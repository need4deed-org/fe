import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const { sameSitePath } = loadModule("src/utils/helpers.ts");

test("sameSitePath keeps app paths", () => {
  assert.equal(sameSitePath("/en/register/agent/complete?token=a.b.c"), "/en/register/agent/complete?token=a.b.c");
  assert.equal(sameSitePath("/de/dashboard"), "/de/dashboard");
});

test("sameSitePath rejects anything that can leave the site", () => {
  for (const value of [
    null,
    "",
    "https://evil.example/x",
    "//evil.example/x",
    "/\\evil.example/x",
    "javascript:alert(1)",
    "en/login",
  ]) {
    assert.equal(sameSitePath(value), null, String(value));
  }
});
