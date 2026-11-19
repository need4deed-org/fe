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

const { textLength, allowedTextLength, getOpportunityTextLimits } = loadModule("src/utils/opportunity-text-limits.ts");

const opportunity = (overrides = {}) => ({
  title: "Garden help",
  description: "Water the plants.",
  volunteerType: "regular",
  originalLanguage: "de",
  ...overrides,
});

test("counts code points and ignores surrounding whitespace, like be", () => {
  assert.equal(textLength("  abc \n"), 3);
  assert.equal(textLength("👍🏽x"), 3);
  assert.equal(textLength(null), 0);
});

test("text over the limit keeps its own length as the limit", () => {
  assert.equal(allowedTextLength(500, "a".repeat(1322)), 1322);
  assert.equal(allowedTextLength(500, "a".repeat(10)), 500);
  assert.equal(allowedTextLength(500), 500);
});

test("editing in the original language uses the source limits", () => {
  assert.deepEqual(getOpportunityTextLimits(opportunity(), "de"), { title: 150, description: 500 });
});

test("an opportunity without an original language counts as German, like be", () => {
  assert.deepEqual(getOpportunityTextLimits(opportunity({ originalLanguage: undefined }), "de"), {
    title: 150,
    description: 500,
  });
});

test("editing a regular or events opportunity in another language uses the translation caps", () => {
  assert.deepEqual(getOpportunityTextLimits(opportunity(), "en"), { title: 300, description: 2000 });
  assert.deepEqual(getOpportunityTextLimits(opportunity({ volunteerType: "events" }), "en"), {
    title: 300,
    description: 2000,
  });
});

test("an accompanying description is never translated, so it keeps the source limit", () => {
  assert.deepEqual(getOpportunityTextLimits(opportunity({ volunteerType: "accompanying" }), "en"), {
    title: 300,
    description: 500,
  });
});

test("a legacy description over 500 stays editable at its current length", () => {
  const limits = getOpportunityTextLimits(opportunity({ description: "a".repeat(1322) }), "de");
  assert.equal(limits.description, 1322);
});
