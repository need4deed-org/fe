import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadModule } from "./helpers/load-module.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const { resolveLeadFromTitles } = loadModule("src/components/Dashboard/Profile/sections/LeadFrom/helper.ts");

const translations = (lng) =>
  JSON.parse(fs.readFileSync(path.join(root, "public/locales", lng, "translations.json"), "utf8"));

const backendOptions = [
  { id: 1, title: "Volunteering platform" },
  { id: 2, title: "Social media" },
  { id: 5, title: "Friends" },
];

test("returns empty array when leadFrom is missing or empty", () => {
  assert.deepEqual(resolveLeadFromTitles(undefined, backendOptions), []);
  assert.deepEqual(resolveLeadFromTitles([], backendOptions), []);
});

test("resolves OptionItem entries using localized titles from backend options", () => {
  assert.deepEqual(
    resolveLeadFromTitles(
      [
        { id: 1, title: "platform" },
        { id: 5, title: "Friends" },
      ],
      backendOptions,
    ),
    ["Volunteering platform", "Friends"],
  );
});

test("falls back to item title when backend options have not loaded or do not include the id", () => {
  assert.deepEqual(resolveLeadFromTitles([{ id: 2, title: "Social media" }], []), ["Social media"]);
  assert.deepEqual(resolveLeadFromTitles([{ id: 99, title: "Podcast" }], backendOptions), ["Podcast"]);
});

test("deduplicates titles and skips blank entries", () => {
  assert.deepEqual(
    resolveLeadFromTitles(
      [
        { id: 1, title: "platform" },
        { id: 1, title: "Volunteering platform" },
        { id: 99, title: "   " },
        { id: 2, title: "media" },
      ],
      backendOptions,
    ),
    ["Volunteering platform", "Social media"],
  );
});

test("leadFrom translation keys exist in en and de", () => {
  for (const lng of ["en", "de"]) {
    const profile = translations(lng).dashboard.volunteerProfile;
    assert.ok(profile.leadFrom, `${lng}: dashboard.volunteerProfile.leadFrom`);
    assert.ok(profile.leadFromEmpty, `${lng}: dashboard.volunteerProfile.leadFromEmpty`);
  }
});
