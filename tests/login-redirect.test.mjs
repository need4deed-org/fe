import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { UserRole } from "need4deed-sdk";
import { loadModule } from "./helpers/load-module.mjs";

const packageRequire = createRequire(import.meta.url);
const { NextRequest } = packageRequire("next/server");

const helpers = loadModule("src/utils/helpers.ts");
const { middleware } = loadModule("src/middleware.ts");

const roleToken = (role) => `header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`;

function assertRedirect(path, preference, expectedPath, token) {
  const origin = "http://localhost:3000";
  const cookies = [preference && `preferred-lang=${preference}`, token && `refresh=${token}`].filter(Boolean);
  const headers = { cookie: cookies.join("; ") };
  const response = middleware(new NextRequest(origin + path, { headers }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), origin + expectedPath);
}

test("signed-out redirects preserve the route language when the saved preference conflicts", () => {
  for (const [language, preference] of [
    ["de", "en"],
    ["en", "de"],
  ]) {
    assertRedirect(`/${language}/dashboard?tab=open`, preference, `/${language}/login`);
    assertRedirect(`/${language}/forms/opportunity?ref=form`, preference, `/${language}/login?ref=form`);
  }
});

test("signed-out redirects without a supported route language go to the saved or default language in one hop", () => {
  assertRedirect("/dashboard?tab=open", "de", "/de/login");
  assertRedirect("/fr/dashboard", "de", "/de/login");
  assertRedirect("/dashboard", undefined, "/en/login");
  assertRedirect("/forms/opportunity?ref=form", "de", "/de/login?ref=form");
  assertRedirect("/fr/forms/opportunity", "fr", "/en/login");
});

test("paths without a supported route language get the saved or default language", () => {
  assertRedirect("/login", "de", "/de/login");
  assertRedirect("/login", undefined, "/en/login");
  assertRedirect("/fr/login?ref=test", "de", "/de/login?ref=test");
  assertRedirect("/DE/login", undefined, "/en/login");
});

test("role redirects retain the route language and query through the destination", () => {
  const cases = [
    [UserRole.AGENT, "/dashboard/admin", "/dashboard"],
    [UserRole.VOLUNTEER, "/dashboard/posts", "/dashboard"],
    [UserRole.VOLUNTEER, "/dashboard/organizations/7", "/dashboard"],
    [UserRole.USER, "/dashboard/agents/42", "/dashboard/agents"],
    [UserRole.USER, "/dashboard/organizations/7", "/dashboard"],
    [UserRole.AGENT, "/dashboard/calendar", "/dashboard"],
  ];
  const origin = "http://localhost:3000";
  for (const [language, preference] of [
    ["de", "en"],
    ["en", "de"],
  ]) {
    for (const [role, from, to] of cases) {
      const token = roleToken(role);
      const destination = `/${language}${to}?ref=test`;
      assertRedirect(`/${language}${from}?ref=test`, preference, destination, token);
      const response = middleware(
        new NextRequest(origin + destination, {
          headers: { cookie: `preferred-lang=${preference}; refresh=${token}` },
        }),
      );
      assert.equal(response.status, 200);
      assert.equal(response.cookies.get("preferred-lang")?.value, language);
    }
  }
});

test("role redirects without a supported route language reach the localized destination in one hop", () => {
  assertRedirect("/dashboard/admin", "de", "/de/dashboard", roleToken(UserRole.AGENT));
  assertRedirect("/dashboard/agents/42", undefined, "/en/dashboard/agents", roleToken(UserRole.USER));
});

test("allowed agent-detail requests pass through the shared language handling", () => {
  const origin = "http://localhost:3000";
  for (const role of [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.AGENT]) {
    const headers = { cookie: `preferred-lang=en; refresh=${roleToken(role)}` };
    const response = middleware(new NextRequest(`${origin}/de/dashboard/agents/42`, { headers }));
    assert.equal(response.status, 200);
    assert.equal(response.cookies.get("preferred-lang")?.value, "de");

    assertRedirect("/dashboard/agents/42", "de", "/de/dashboard/agents/42", roleToken(role));
  }
});

test("allowed organization-detail requests pass through the shared language handling", () => {
  const origin = "http://localhost:3000";
  for (const role of [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.AGENT]) {
    const headers = { cookie: `preferred-lang=en; refresh=${roleToken(role)}` };
    const response = middleware(new NextRequest(`${origin}/de/dashboard/organizations/7`, { headers }));
    assert.equal(response.status, 200);
    assert.equal(response.cookies.get("preferred-lang")?.value, "de");

    assertRedirect("/dashboard/organizations/7", "de", "/de/dashboard/organizations/7", roleToken(role));
  }
});

test("login paths for client redirects keep a supported URL language, else fall back", () => {
  assert.equal(helpers.getLoginPath("/de/persons"), "/de/login");
  assert.equal(helpers.getLoginPath("/en/persons"), "/en/login");
  assert.equal(helpers.getLoginPath("/fr/persons"), "/en/login");
  assert.equal(helpers.getLoginPath("/persons"), "/en/login");
});

test("login paths fall back to the saved language cookie before the default", () => {
  const previous = globalThis.document;
  try {
    globalThis.document = { cookie: "auth_hint=true; preferred-lang=de" };
    assert.equal(helpers.getLoginPath("/persons"), "/de/login");
    assert.equal(helpers.getLoginPath("/en/persons"), "/en/login");
    globalThis.document = { cookie: "preferred-lang=fr" };
    assert.equal(helpers.getLoginPath("/persons"), "/en/login");
  } finally {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});
