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

const { fetchPLZExists, canSubmitPLZ, resolvePLZStatus } = loadModule("src/utils/plz-check.ts");

const apiPath = "/api/postcode/check";
const respond = (body) => async () => ({ data: body });

test("a PLZ on be's reference list is known", async () => {
  assert.equal(await fetchPLZExists(apiPath, "10969", respond({ data: { code: "10969", known: true } })), true);
});

test("a PLZ missing from be's reference list is unknown", async () => {
  assert.equal(await fetchPLZExists(apiPath, "10699", respond({ data: { code: "10699", known: false } })), false);
});

test("asks be's postcode check for the given PLZ with a timeout", async () => {
  let calledWith;
  const getFn = async (url, config) => {
    calledWith = { url, config };
    return { data: { data: { code: "01067", known: true } } };
  };
  await fetchPLZExists(apiPath, "01067", getFn, 1234);
  assert.deepEqual(calledWith, { url: apiPath, config: { params: { code: "01067" }, timeout: 1234 } });
});

test("an unexpected body or a failed request throws (unavailable)", async () => {
  await assert.rejects(fetchPLZExists(apiPath, "10969", respond({ data: { code: "10969" } })));
  await assert.rejects(fetchPLZExists(apiPath, "10969", respond("")));
  await assert.rejects(
    fetchPLZExists(apiPath, "10969", async () => {
      throw new Error("Network Error");
    }),
  );
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
