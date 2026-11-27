import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadModule } from "./helpers/load-module.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { isContactErased } = loadModule(
  "src/components/Dashboard/Profile/sections/AccompanyingDetails/contact-erased.ts",
);
const today = new Date(2026, 10, 27, 9);

test("an empty name and phone more than a month after the appointment reads as erased", () => {
  assert.equal(isContactErased({ appointmentDate: new Date(2026, 9, 26, 15) }, today), true);
});

test("a month to the day, a later appointment or a kept name or phone is not erased", () => {
  assert.equal(isContactErased({ appointmentDate: new Date(2026, 9, 27, 15) }, today), false);
  assert.equal(isContactErased({ appointmentDate: new Date(2026, 10, 20) }, today), false);
  assert.equal(isContactErased({ appointmentDate: new Date(2026, 8, 1), refugeeName: "A" }, today), false);
  assert.equal(isContactErased({ appointmentDate: new Date(2026, 8, 1), refugeeNumber: "1" }, today), false);
  assert.equal(isContactErased({ appointmentDate: null }, today), false);
});

test("the erased label exists in en and de", () => {
  for (const lng of ["en", "de"]) {
    const dict = JSON.parse(fs.readFileSync(path.join(root, "public/locales", lng, "translations.json"), "utf8"));
    assert.equal(typeof dict.dashboard.opportunityProfile.accompanyingDetails.contactErased, "string", lng);
  }
});
