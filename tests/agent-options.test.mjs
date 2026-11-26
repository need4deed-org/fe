import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const { resolveProjectId, sortAgentOptions } = loadModule("src/utils/agent-options.ts");

test("sortAgentOptions sorts by title and falls back to the id while an NGO loads", () => {
  const options = sortAgentOptions([3, 1, 2], [{ id: 1, title: "Beta" }, undefined, { id: 3, title: "Alpha" }]);
  assert.deepEqual(options, [
    { id: 2, title: "2" },
    { id: 3, title: "Alpha" },
    { id: 1, title: "Beta" },
  ]);
});

const base = { requested: "2", agentIds: [1, 2], isAgent: true, isLoading: false, traegerId: 9 };

test("resolveProjectId keeps an id the Träger user belongs to", () => {
  assert.equal(resolveProjectId(base), 2);
});

test("resolveProjectId applies the URL id while the NGOs are still loading", () => {
  assert.equal(resolveProjectId({ ...base, isLoading: true, traegerId: undefined }), 2);
});

test("resolveProjectId drops the id once loaded for non-Träger users", () => {
  assert.equal(resolveProjectId({ ...base, traegerId: undefined }), undefined);
});

test("resolveProjectId ignores foreign, missing and single-NGO ids", () => {
  assert.equal(resolveProjectId({ ...base, requested: "7" }), undefined);
  assert.equal(resolveProjectId({ ...base, requested: null }), undefined);
  assert.equal(resolveProjectId({ ...base, agentIds: [2] }), undefined);
  assert.equal(resolveProjectId({ ...base, isAgent: false }), undefined);
});
