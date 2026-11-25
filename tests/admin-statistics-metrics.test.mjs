import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { StatisticsMetric } from "need4deed-sdk";
import { loadModule } from "./helpers/load-module.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const translations = (lng) =>
  JSON.parse(fs.readFileSync(path.join(root, "public/locales", lng, "translations.json"), "utf8"));
const lookup = (dict, key) => key.split(".").reduce((node, part) => node?.[part], dict);

const { METRIC_OPTIONS } = loadModule("src/components/Dashboard/Admin/Statistics/metrics.ts");

test("the picker offers every metric except the legacy requests alias", () => {
  const offered = METRIC_OPTIONS.map(({ metric }) => metric).sort();
  const expected = Object.values(StatisticsMetric)
    .filter((metric) => metric !== StatisticsMetric.REQUESTS)
    .sort();
  assert.deepEqual(offered, expected);
});

test("every metric label and note exists in en and de", () => {
  for (const lng of ["en", "de"]) {
    const dict = translations(lng);
    for (const { metric, labelKey, noteKey } of METRIC_OPTIONS) {
      assert.equal(typeof lookup(dict, labelKey), "string", `${lng}: ${metric} label`);
      if (noteKey) assert.equal(typeof lookup(dict, noteKey), "string", `${lng}: ${metric} note`);
    }
  }
});

test("month-end snapshot metrics carry the snapshot note", () => {
  const withNote = METRIC_OPTIONS.filter(({ noteKey }) => noteKey).map(({ metric }) => metric);
  assert.deepEqual(withNote.sort(), [StatisticsMetric.ACTIVE_VOLUNTEERS, StatisticsMetric.AVAILABLE_VOLUNTEERS].sort());
});
