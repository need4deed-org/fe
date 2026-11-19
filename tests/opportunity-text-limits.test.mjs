import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const { textLength, textLimit, getTextLimitIssue, getOpportunityTextLimits } = loadModule(
  "src/utils/opportunity-text-limits.ts",
);

const opportunity = (overrides = {}) => ({
  title: "Garden help",
  description: "Water the plants.",
  volunteerType: "regular",
  originalLanguage: "de",
  ...overrides,
});
const limit = (max, allowed = max) => ({ max, allowed });

test("counts code points and ignores surrounding whitespace, like be", () => {
  assert.equal(textLength("  abc \n"), 3);
  assert.equal(textLength("👍🏽x"), 3);
  assert.equal(textLength(null), 0);
});

test("text over the limit keeps its own length as the allowance", () => {
  assert.deepEqual(textLimit(500, "a".repeat(1322)), limit(500, 1322));
  assert.deepEqual(textLimit(500, "a".repeat(10)), limit(500));
  assert.deepEqual(textLimit(500), limit(500));
});

test("text within the limit is fine; over it is too long", () => {
  assert.equal(getTextLimitIssue("a".repeat(500), limit(500)), null);
  assert.equal(getTextLimitIssue(`${"a".repeat(500)}  `, limit(500)), null);
  assert.equal(getTextLimitIssue("a".repeat(501), limit(500)), "tooLong");
});

test("over-limit text may stay or shrink, but not grow", () => {
  const legacy = limit(500, 1322);
  assert.equal(getTextLimitIssue("a".repeat(1322), legacy), null);
  assert.equal(getTextLimitIssue("a".repeat(800), legacy), null);
  assert.equal(getTextLimitIssue("a".repeat(1323), legacy), "shortenOnly");
});

test("editing in the original language uses the source limits", () => {
  assert.deepEqual(getOpportunityTextLimits(opportunity(), "de"), { title: limit(150), description: limit(500) });
});

test("an opportunity without an original language counts as German, like be", () => {
  assert.deepEqual(getOpportunityTextLimits(opportunity({ originalLanguage: undefined }), "de"), {
    title: limit(150),
    description: limit(500),
  });
});

test("editing a regular or events opportunity in another language uses the translation caps", () => {
  const expected = { title: limit(300), description: limit(2000) };
  assert.deepEqual(getOpportunityTextLimits(opportunity(), "en"), expected);
  assert.deepEqual(getOpportunityTextLimits(opportunity({ volunteerType: "events" }), "en"), expected);
});

test("an accompanying description is never translated, so it keeps the source limit", () => {
  assert.deepEqual(getOpportunityTextLimits(opportunity({ volunteerType: "accompanying" }), "en"), {
    title: limit(300),
    description: limit(500),
  });
});

test("a legacy source description over 500 stays editable at its current length", () => {
  const limits = getOpportunityTextLimits(opportunity({ description: "a".repeat(1322) }), "de");
  assert.deepEqual(limits.description, limit(500, 1322));
});

test("a translated field gets no allowance from the text shown, which may be the source fallback", () => {
  const limits = getOpportunityTextLimits(opportunity({ title: "a".repeat(400), description: "a".repeat(2400) }), "en");
  assert.deepEqual(limits, { title: limit(300), description: limit(2000) });
});
