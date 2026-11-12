import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const packageRequire = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadModule(file) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const loadedModule = { exports: {} };
  new Function("require", "module", "exports", output)(packageRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const { fetchPLZExists, canSubmitPLZ, resolvePLZStatus, openPlzLocalitiesUrl } = loadModule("src/utils/openplz.ts");

const respond =
  (body, ok = true) =>
  async () => ({ ok, json: async () => body });

test("a PLZ with localities is known", async () => {
  const fetchFn = respond([{ postalCode: "10969", name: "Berlin" }]);
  assert.equal(await fetchPLZExists("10969", fetchFn), true);
});

test("a PLZ without localities is unknown", async () => {
  assert.equal(await fetchPLZExists("10699", respond([])), false);
});

test("queries the localities endpoint for the given PLZ", async () => {
  let calledWith;
  const fetchFn = async (url, init) => {
    calledWith = { url, init };
    return { ok: true, json: async () => [] };
  };
  await fetchPLZExists("01067", fetchFn);
  assert.equal(calledWith.url, `${openPlzLocalitiesUrl}?postalCode=01067`);
  assert.ok(calledWith.init.signal instanceof AbortSignal);
});

test("an error response, unexpected body or network failure throws (unavailable)", async () => {
  await assert.rejects(fetchPLZExists("10969", respond([], false)));
  await assert.rejects(fetchPLZExists("10969", respond({ error: "x" })));
  await assert.rejects(
    fetchPLZExists("10969", async () => {
      throw new TypeError("Failed to fetch");
    }),
  );
});

test("a slow response times out (unavailable)", async () => {
  const hang = (_url, { signal }) =>
    new Promise((_resolve, reject) => {
      const keepAlive = setTimeout(() => reject(new Error("timeout did not fire")), 1000);
      signal.addEventListener("abort", () => {
        clearTimeout(keepAlive);
        reject(signal.reason);
      });
    });
  await assert.rejects(fetchPLZExists("10969", hang, 20), { name: "TimeoutError" });
});

test("unknown and pending block submit; known, unavailable and idle don't", () => {
  assert.equal(canSubmitPLZ("unknown"), false);
  assert.equal(canSubmitPLZ("pending"), false);
  assert.equal(canSubmitPLZ("known"), true);
  assert.equal(canSubmitPLZ("unavailable"), true);
  assert.equal(canSubmitPLZ("idle"), true);
});

const lookup = (overrides) => ({ isCandidate: true, isSettled: true, isError: false, exists: undefined, ...overrides });

test("a PLZ failing the range check is idle, whatever the lookup says", () => {
  assert.equal(resolvePLZStatus(lookup({ isCandidate: false, exists: false })), "idle");
  assert.equal(resolvePLZStatus(lookup({ isCandidate: false, isSettled: false })), "idle");
});

test("pending while typing or while the lookup runs", () => {
  assert.equal(resolvePLZStatus(lookup({ isSettled: false, exists: true })), "pending");
  assert.equal(resolvePLZStatus(lookup({})), "pending");
});

test("a failed lookup is unavailable; an answered one is known or unknown", () => {
  assert.equal(resolvePLZStatus(lookup({ isError: true })), "unavailable");
  assert.equal(resolvePLZStatus(lookup({ exists: true })), "known");
  assert.equal(resolvePLZStatus(lookup({ exists: false })), "unknown");
});
