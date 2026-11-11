import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { UserRole } from "need4deed-sdk";

const packageRequire = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadModule(file) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const loadedModule = { exports: {} };
  new Function("require", "module", "exports", output)(packageRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const { isOwnProfile } = loadModule("src/utils/is-own-profile.ts");

test("a volunteer owns the profile with their personId", () => {
  assert.equal(isOwnProfile({ role: UserRole.VOLUNTEER, personId: 7 }, { personId: 7 }), true);
  assert.equal(isOwnProfile({ role: UserRole.VOLUNTEER, personId: 7 }, { personId: "7" }), true);
});

test("an NGO user owns the profile with their agentId", () => {
  assert.equal(isOwnProfile({ role: UserRole.AGENT, agentId: 5 }, { agentId: 5 }), true);
  assert.equal(isOwnProfile({ role: UserRole.AGENT, agentId: "5" }, { agentId: "5" }), true);
});

test("an NGO user owns the profiles of every NGO they're a member of", () => {
  const viewer = {
    role: UserRole.AGENT,
    agentId: 5,
    agentMemberships: [
      { agentId: 5, agentTitle: "A" },
      { agentId: 9, agentTitle: "B" },
    ],
  };
  assert.equal(isOwnProfile(viewer, { agentId: 9 }), true);
  assert.equal(isOwnProfile(viewer, { agentId: "9" }), true);
  assert.equal(isOwnProfile(viewer, { agentId: 11 }), false);
});

test("a volunteer's agentMemberships never make them an NGO owner", () => {
  assert.equal(
    isOwnProfile(
      { role: UserRole.VOLUNTEER, personId: 1, agentMemberships: [{ agentId: 9, agentTitle: "B" }] },
      { agentId: 9 },
    ),
    false,
  );
});

test("a volunteer whose personId equals the agent id doesn't own the agent", () => {
  assert.equal(isOwnProfile({ role: UserRole.VOLUNTEER, personId: 42, agentId: 0 }, { agentId: 42 }), false);
});

test("an NGO user whose agentId equals the person id doesn't own the volunteer", () => {
  assert.equal(isOwnProfile({ role: UserRole.AGENT, agentId: 42, personId: 1 }, { personId: 42 }), false);
});

test("missing ids never match", () => {
  assert.equal(isOwnProfile({ role: UserRole.VOLUNTEER, personId: null }, { personId: undefined }), false);
  assert.equal(isOwnProfile({ role: UserRole.AGENT }, { agentId: undefined }), false);
  assert.equal(isOwnProfile({ role: UserRole.AGENT, agentId: 5 }, undefined), false);
  assert.equal(isOwnProfile(undefined, { agentId: 5 }), false);
});

test("staff don't own profiles through this check", () => {
  assert.equal(
    isOwnProfile({ role: UserRole.COORDINATOR, personId: 3, agentId: 3 }, { personId: 3, agentId: 3 }),
    false,
  );
});
