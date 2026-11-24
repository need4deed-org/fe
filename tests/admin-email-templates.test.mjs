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

const editorHelpers = loadModule("src/components/Dashboard/Admin/EmailTemplates/helpers.ts");
const single = (subject, text, labels) => ({
  layout: EmailTemplateLayout.SINGLE,
  content: { subject, text, ...(labels ? { labels } : {}) },
});

test("isPerLanguageAllowed reads allowedLayouts", () => {
  assert.equal(editorHelpers.isPerLanguageAllowed([EmailTemplateLayout.SINGLE]), false);
  assert.equal(
    editorHelpers.isPerLanguageAllowed([EmailTemplateLayout.SINGLE, EmailTemplateLayout.PER_LANGUAGE]),
    true,
  );
});

test("switching single to per-language copies the text into both languages", () => {
  const draft = single("S", "T", { someone: "Jemand" });
  const split = editorHelpers.switchLayout(draft, EmailTemplateLayout.PER_LANGUAGE);

  assert.equal(split.layout, EmailTemplateLayout.PER_LANGUAGE);
  assert.deepEqual(split.content.de, draft.content);
  assert.deepEqual(split.content.en, draft.content);

  split.content.en.labels.someone = "Someone";
  assert.equal(split.content.de.labels.someone, "Jemand");
  assert.equal(draft.content.labels.someone, "Jemand");
});

test("switching per-language to single keeps the German text", () => {
  const draft = {
    layout: EmailTemplateLayout.PER_LANGUAGE,
    content: { de: { subject: "Betreff", text: "Hallo" }, en: { subject: "Subject", text: "Hi" } },
  };
  assert.deepEqual(editorHelpers.switchLayout(draft, EmailTemplateLayout.SINGLE), single("Betreff", "Hallo"));
});

test("switching to the current layout returns the same draft", () => {
  const draft = single("S", "T");
  assert.equal(editorHelpers.switchLayout(draft, EmailTemplateLayout.SINGLE), draft);
});

test("updateText and updateLabel change only the edited language", () => {
  const draft = editorHelpers.switchLayout(single("S", "T", { someone: "Jemand" }), EmailTemplateLayout.PER_LANGUAGE);

  const edited = editorHelpers.updateLabel(
    editorHelpers.updateText(draft, "en", { subject: "New" }),
    "en",
    "noName",
    "there",
  );

  assert.deepEqual(editorHelpers.textOf(edited, "en"), {
    subject: "New",
    text: "T",
    labels: { someone: "Jemand", noName: "there" },
  });
  assert.deepEqual(editorHelpers.textOf(edited, "de"), draft.content.de);
  assert.equal(draft.content.en.subject, "S");
});

test("a single draft is edited whatever language is picked", () => {
  const edited = editorHelpers.updateText(single("S", "T"), "en", { text: "Neu" });
  assert.deepEqual(edited, single("S", "Neu"));
  assert.deepEqual(editorHelpers.textOf(edited, "en"), editorHelpers.textOf(edited, "de"));
});

test("toSingleLine turns line breaks into spaces", () => {
  assert.equal(editorHelpers.toSingleLine("a\nb\r\nc"), "a b c");
});

test("every label key the be sends has an en and de caption", () => {
  const keys = ["commentOnVolunteer", "commentOnOpportunity", "commentOnAgent", "comment", "post", "someone", "noName"];
  for (const lng of ["en", "de"]) {
    const dict = translations(lng);
    for (const key of keys) {
      assert.equal(typeof lookup(dict, `dashboard.admin.emailTemplates.labelNames.${key}`), "string", `${lng}: ${key}`);
    }
  }
});
