import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { EmailTemplateLayout, EmailTemplateName } from "need4deed-sdk";
import { loadModule } from "./helpers/load-module.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const translations = (lng) =>
  JSON.parse(fs.readFileSync(path.join(root, "public/locales", lng, "translations.json"), "utf8"));
const lookup = (dict, key) => key.split(".").reduce((node, part) => node?.[part], dict);

const { isTemplateName, sortByLabel, templateLabelKey } = loadModule(
  "src/components/Dashboard/Admin/EmailTemplates/helpers.ts",
);

test("every template has an en and de name", () => {
  for (const lng of ["en", "de"]) {
    const dict = translations(lng);
    for (const name of Object.values(EmailTemplateName)) {
      assert.equal(typeof lookup(dict, templateLabelKey(name)), "string", `${lng}: ${name}`);
    }
  }
});

test("isTemplateName accepts template names only", () => {
  assert.equal(isTemplateName(EmailTemplateName.PASSWORD_RESET), true);
  assert.equal(isTemplateName(""), false);
  assert.equal(isTemplateName("passwordreset"), false);
});

test("sortByLabel orders by the shown name without changing the input", () => {
  const item = (name) => ({ name, layout: EmailTemplateLayout.SINGLE, allowedLayouts: [EmailTemplateLayout.SINGLE] });
  const templates = [item(EmailTemplateName.TAGGED), item(EmailTemplateName.STALE), item(EmailTemplateName.UPDATE)];
  const labels = { tagged: "Ärger", stale: "Zebra", update: "Apfel" };

  const sorted = sortByLabel(templates, (name) => labels[name], "de");

  assert.deepEqual(
    sorted.map(({ name }) => name),
    [EmailTemplateName.UPDATE, EmailTemplateName.TAGGED, EmailTemplateName.STALE],
  );
  assert.equal(templates[0].name, EmailTemplateName.TAGGED);
});
