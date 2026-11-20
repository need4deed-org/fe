import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const { textLength, textLimit, getTextLimitIssue, getTextLimitMessage, getOpportunityTextLimits } = loadModule(
  "src/utils/opportunity-text-limits.ts",
);

const opportunity = (overrides = {}) => ({
  title: "Garden help",
  description: "Water the plants.",
  volunteerType: "regular",
  originalLanguage: "de",
  ...overrides,
});
const limit = (max, allowed = max, current = "") => ({ max, allowed, current });
const caps = ({ max, allowed }) => ({ max, allowed });
const capsOf = (limits) => ({ title: caps(limits.title), description: caps(limits.description) });

test("counts code points and ignores surrounding whitespace, like be", () => {
  assert.equal(textLength("  abc \n"), 3);
  assert.equal(textLength("👍🏽x"), 3);
  assert.equal(textLength(null), 0);
});

test("text over the limit keeps its own length as the allowance", () => {
  assert.deepEqual(textLimit(500, "a".repeat(1322)), limit(500, 1322, "a".repeat(1322)));
  assert.deepEqual(textLimit(500, "a".repeat(10)), limit(500, 500, "a".repeat(10)));
  assert.deepEqual(textLimit(500), limit(500));
});

test("text within the limit is fine; over it is too long", () => {
  assert.equal(getTextLimitIssue("a".repeat(500), limit(500)), null);
  assert.equal(getTextLimitIssue(`${"a".repeat(500)}  `, limit(500)), null);
  assert.equal(getTextLimitIssue("a".repeat(501), limit(500)), "tooLong");
});

test("over-limit text may stay or shrink, but not grow", () => {
  const legacy = textLimit(500, "a".repeat(1322));
  assert.equal(getTextLimitIssue("b".repeat(1322), legacy), null);
  assert.equal(getTextLimitIssue("a".repeat(800), legacy), null);
  assert.equal(getTextLimitIssue("a".repeat(1323), legacy), "shortenOnly");
});

test("unchanged text is never an issue, so an untouched field can't block the form", () => {
  const current = "a".repeat(2400);
  assert.equal(getTextLimitIssue(`${current} `, textLimit(500, current)), null);
  assert.equal(getTextLimitIssue(current, limit(2000)), "tooLong");
});

test("messages name the cap, the allowance and the length typed now", () => {
  const t = (key, options) => `${key}:${options.max}/${options.allowed}/${options.count}`;
  const messages = { tooLong: "tooLong", shortenOnly: "shortenOnly" };
  assert.equal(getTextLimitMessage(t, "a".repeat(10), limit(500), messages), null);
  assert.equal(getTextLimitMessage(t, "a".repeat(501), limit(500), messages), "tooLong:500/500/501");
  assert.equal(
    getTextLimitMessage(t, "a".repeat(1330), textLimit(500, "b".repeat(1322)), messages),
    "shortenOnly:500/1322/1330",
  );
});

test("editing in the original language uses the source limits", () => {
  assert.deepEqual(capsOf(getOpportunityTextLimits(opportunity(), "de")), {
    title: caps(limit(150)),
    description: caps(limit(500)),
  });
});

test("an opportunity without an original language counts as German, like be", () => {
  assert.deepEqual(capsOf(getOpportunityTextLimits(opportunity({ originalLanguage: undefined }), "de")), {
    title: caps(limit(150)),
    description: caps(limit(500)),
  });
});

test("editing a regular or events opportunity in another language uses the translation caps", () => {
  const expected = { title: caps(limit(300)), description: caps(limit(2000)) };
  assert.deepEqual(capsOf(getOpportunityTextLimits(opportunity(), "en")), expected);
  assert.deepEqual(capsOf(getOpportunityTextLimits(opportunity({ volunteerType: "events" }), "en")), expected);
});

test("an accompanying description is never translated, so it keeps the source limit", () => {
  assert.deepEqual(capsOf(getOpportunityTextLimits(opportunity({ volunteerType: "accompanying" }), "en")), {
    title: caps(limit(300)),
    description: caps(limit(500)),
  });
});

test("a legacy source description over 500 stays editable at its current length", () => {
  const limits = getOpportunityTextLimits(opportunity({ description: "a".repeat(1322) }), "de");
  assert.deepEqual(caps(limits.description), caps(limit(500, 1322)));
});

test("a translated field shown over its cap may stay or shrink, like be's served translation", () => {
  const limits = getOpportunityTextLimits(opportunity({ title: "a".repeat(320) }), "en");
  assert.deepEqual(caps(limits.title), caps(limit(300, 320)));
});
