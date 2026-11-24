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
  const split = editorHelpers.switchLayout(draft, EmailTemplateLayout.PER_LANGUAGE, "de");

  assert.equal(split.layout, EmailTemplateLayout.PER_LANGUAGE);
  assert.deepEqual(split.content.de, draft.content);
  assert.deepEqual(split.content.en, draft.content);

  split.content.en.labels.someone = "Someone";
  assert.equal(split.content.de.labels.someone, "Jemand");
  assert.equal(draft.content.labels.someone, "Jemand");
});

test("switching per-language to single keeps the language shown", () => {
  const draft = {
    layout: EmailTemplateLayout.PER_LANGUAGE,
    content: { de: { subject: "Betreff", text: "Hallo" }, en: { subject: "Subject", text: "Hi" } },
  };
  assert.deepEqual(editorHelpers.switchLayout(draft, EmailTemplateLayout.SINGLE, "de"), single("Betreff", "Hallo"));
  assert.deepEqual(editorHelpers.switchLayout(draft, EmailTemplateLayout.SINGLE, "en"), single("Subject", "Hi"));
});

test("switching to the current layout returns the same draft", () => {
  const draft = single("S", "T");
  assert.equal(editorHelpers.switchLayout(draft, EmailTemplateLayout.SINGLE, "de"), draft);
});

test("updateText and updateLabel change only the edited language", () => {
  const draft = editorHelpers.switchLayout(
    single("S", "T", { someone: "Jemand" }),
    EmailTemplateLayout.PER_LANGUAGE,
    "de",
  );

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

test("insertAt puts the snippet at the cursor and moves the cursor after it", () => {
  const snippet = editorHelpers.placeholderSnippet("link");
  assert.equal(snippet, "{{ link }}");
  assert.deepEqual(editorHelpers.insertAt("Hi !", 3, 3, snippet), { value: "Hi {{ link }}!", caret: 13 });
});

test("insertAt replaces the selected text", () => {
  assert.deepEqual(editorHelpers.insertAt("Hi NAME!", 3, 7, "{{ name }}"), { value: "Hi {{ name }}!", caret: 13 });
});

test("insertAt clamps a cursor outside the text", () => {
  assert.deepEqual(editorHelpers.insertAt("ab", 9, 12, "X"), { value: "abX", caret: 3 });
  assert.deepEqual(editorHelpers.insertAt("ab", -1, 1, "X"), { value: "Xb", caret: 1 });
});

test("toSaveContent drops blank labels so the default text is used", () => {
  assert.deepEqual(
    editorHelpers.toSaveContent(single("S", "T", { someone: " ", noName: "zusammen" })),
    single("S", "T", { noName: "zusammen" }),
  );
  assert.deepEqual(editorHelpers.toSaveContent(single("S", "T", { someone: "" })), single("S", "T"));
});

test("isDirty ignores label order and blank labels, but sees real edits", () => {
  const saved = single("S", "T", { a: "1", b: "2" });
  assert.equal(editorHelpers.isDirty(saved, single("S", "T", { b: "2", a: "1" })), false);
  assert.equal(editorHelpers.isDirty(single("S", "T"), single("S", "T", { a: "" })), false);
  assert.equal(editorHelpers.isDirty(saved, single("S", "T!", { a: "1", b: "2" })), true);
  assert.equal(
    editorHelpers.isDirty(saved, editorHelpers.switchLayout(saved, EmailTemplateLayout.PER_LANGUAGE, "de")),
    true,
  );
});

const names = ["recipientName", "link"];
const view = (error) => editorHelpers.toSaveErrorView({ message: "m", ...error }, names);
const key = (code) => `dashboard.admin.emailTemplates.errors.${code}`;

test("a version conflict gets its own view", () => {
  assert.deepEqual(view({ code: "version_conflict" }), { kind: "conflict" });
});

test("known placeholders without a language ask for one", () => {
  assert.deepEqual(view({ code: "unknown_placeholder", placeholders: ["link"] }), {
    kind: "message",
    key: key("needsLanguage"),
    params: { placeholders: "{{ link }}", example: "{{ link.de }} / {{ link.en }}" },
    lang: undefined,
    fields: [],
  });
});

test("unknown placeholders are listed as sent", () => {
  const result = view({ code: "unknown_placeholder", placeholders: ["link.fr", "{{ x"] });
  assert.equal(result.key, key("unknown_placeholder"));
  assert.deepEqual(result.params, { placeholders: "link.fr, {{ x" });
});

test("missing placeholders and blank fields keep the language and fields", () => {
  const missing = view({ code: "missing_placeholder", placeholders: ["recipientName", "link"], lang: "en" });
  assert.equal(missing.key, key("missing_placeholder"));
  assert.equal(missing.params.placeholders, "{{ recipientName }}, {{ link }}");
  assert.equal(missing.lang, "en");

  const blank = view({ code: "blank_field", fields: ["subject", "labels.someone"], lang: "de" });
  assert.deepEqual(blank, {
    kind: "message",
    key: key("blank_field"),
    lang: "de",
    fields: ["subject", "labels.someone"],
  });
});

test("unknown labels are named without the labels. prefix", () => {
  assert.deepEqual(view({ code: "unknown_label", fields: ["labels.foo"] }).params, { labels: "foo" });
});

test("every save error has an en and de message", () => {
  const codes = [
    "not_editable",
    "layout_not_allowed",
    "missing_placeholder",
    "unknown_placeholder",
    "blank_field",
    "unknown_label",
    "needsLanguage",
    "fieldBlank",
  ];
  for (const lng of ["en", "de"]) {
    for (const code of codes) {
      assert.equal(typeof lookup(translations(lng), key(code)), "string", `${lng}: ${code}`);
    }
  }
});

test("cacheMinutes rounds up to whole minutes", () => {
  assert.equal(editorHelpers.cacheMinutes(300), 5);
  assert.equal(editorHelpers.cacheMinutes(301), 6);
  assert.equal(editorHelpers.cacheMinutes(0), 1);
});

test("inAppPathOf returns the path of a same-origin link to another page", () => {
  const here = "https://app.need4deed.org/en/dashboard/admin/email-templates";
  assert.equal(editorHelpers.inAppPathOf("/en/dashboard/admin/accounts", here), "/en/dashboard/admin/accounts");
  assert.equal(editorHelpers.inAppPathOf("https://app.need4deed.org/de/x?a=1#b", here), "/de/x?a=1#b");
  assert.equal(editorHelpers.inAppPathOf("https://example.org/en", here), null);
  assert.equal(editorHelpers.inAppPathOf(here, here), null);
  assert.equal(editorHelpers.inAppPathOf("#top", here), null);
});
