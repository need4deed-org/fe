import {
  ApiEmailTemplateContent,
  ApiEmailTemplateLayouts,
  ApiEmailTemplateListItem,
  ApiEmailTemplateSaveError,
  ApiEmailTemplateText,
  EmailTemplateLayout,
  EmailTemplateName,
  Lang,
} from "need4deed-sdk";

export const templateLabelKey = (name: EmailTemplateName) => `dashboard.admin.emailTemplates.names.${name}`;

export const isTemplateName = (value: string): value is EmailTemplateName =>
  (Object.values(EmailTemplateName) as string[]).includes(value);

export function sortByLabel(
  templates: ApiEmailTemplateListItem[],
  labelOf: (name: EmailTemplateName) => string,
  locale: string,
): ApiEmailTemplateListItem[] {
  return [...templates].sort((a, b) => labelOf(a.name).localeCompare(labelOf(b.name), locale));
}

export const LANGS = [Lang.DE, Lang.EN];

export const isPerLanguageAllowed = (allowedLayouts: ApiEmailTemplateLayouts) =>
  (allowedLayouts as EmailTemplateLayout[]).includes(EmailTemplateLayout.PER_LANGUAGE);

const copyText = ({ subject, text, labels }: ApiEmailTemplateText): ApiEmailTemplateText => ({
  subject,
  text,
  ...(labels ? { labels: { ...labels } } : {}),
});

export function switchLayout(content: ApiEmailTemplateContent, to: EmailTemplateLayout): ApiEmailTemplateContent {
  if (content.layout === to) return content;
  if (content.layout === EmailTemplateLayout.SINGLE) {
    return {
      layout: EmailTemplateLayout.PER_LANGUAGE,
      content: { [Lang.DE]: copyText(content.content), [Lang.EN]: copyText(content.content) },
    };
  }
  return { layout: EmailTemplateLayout.SINGLE, content: copyText(content.content[Lang.DE]) };
}

export const textOf = (content: ApiEmailTemplateContent, lang: Lang): ApiEmailTemplateText =>
  content.layout === EmailTemplateLayout.SINGLE ? content.content : content.content[lang];

export function updateText(
  content: ApiEmailTemplateContent,
  lang: Lang,
  patch: Partial<ApiEmailTemplateText>,
): ApiEmailTemplateContent {
  if (content.layout === EmailTemplateLayout.SINGLE) {
    return { ...content, content: { ...content.content, ...patch } };
  }
  return { ...content, content: { ...content.content, [lang]: { ...content.content[lang], ...patch } } };
}

export const updateLabel = (content: ApiEmailTemplateContent, lang: Lang, key: string, value: string) =>
  updateText(content, lang, { labels: { ...textOf(content, lang).labels, [key]: value } });

export const toSingleLine = (value: string) => value.replace(/\r?\n/g, " ");

export const placeholderSnippet = (name: string) => `{{ ${name} }}`;

export function insertAt(value: string, start: number, end: number, snippet: string) {
  const from = Math.max(0, Math.min(start, value.length));
  const to = Math.max(from, Math.min(end, value.length));
  return { value: value.slice(0, from) + snippet + value.slice(to), caret: from + snippet.length };
}

const withoutBlankLabels = ({ subject, text, labels }: ApiEmailTemplateText): ApiEmailTemplateText => {
  const kept = Object.entries(labels ?? {})
    .filter(([, value]) => value.trim())
    .sort(([a], [b]) => a.localeCompare(b));
  return { subject, text, ...(kept.length > 0 ? { labels: Object.fromEntries(kept) } : {}) };
};

export function toSaveContent(content: ApiEmailTemplateContent): ApiEmailTemplateContent {
  if (content.layout === EmailTemplateLayout.SINGLE) {
    return { layout: content.layout, content: withoutBlankLabels(content.content) };
  }
  return {
    layout: content.layout,
    content: {
      [Lang.DE]: withoutBlankLabels(content.content[Lang.DE]),
      [Lang.EN]: withoutBlankLabels(content.content[Lang.EN]),
    },
  };
}

export const isDirty = (saved: ApiEmailTemplateContent, draft: ApiEmailTemplateContent) =>
  JSON.stringify(toSaveContent(saved)) !== JSON.stringify(toSaveContent(draft));

export type SaveErrorView =
  | { kind: "conflict" }
  | { kind: "message"; key: string; params?: Record<string, string>; lang?: Lang; fields: string[] };

const errorKey = (code: string) => `dashboard.admin.emailTemplates.errors.${code}`;
const listOf = (names: string[]) => names.map(placeholderSnippet).join(", ");

export function toSaveErrorView(error: ApiEmailTemplateSaveError, placeholderNames: string[]): SaveErrorView {
  if (error.code === "version_conflict") return { kind: "conflict" };

  const placeholders = error.placeholders ?? [];
  const base = { kind: "message" as const, lang: error.lang, fields: error.fields ?? [] };

  if (error.code === "unknown_placeholder") {
    const needsLanguage = placeholders.length > 0 && placeholders.every((name) => placeholderNames.includes(name));
    return needsLanguage
      ? {
          ...base,
          key: errorKey("needsLanguage"),
          params: {
            placeholders: listOf(placeholders),
            example: `${placeholderSnippet(`${placeholders[0]}.de`)} / ${placeholderSnippet(`${placeholders[0]}.en`)}`,
          },
        }
      : { ...base, key: errorKey(error.code), params: { placeholders: placeholders.join(", ") } };
  }
  if (error.code === "missing_placeholder") {
    return { ...base, key: errorKey(error.code), params: { placeholders: listOf(placeholders) } };
  }
  if (error.code === "unknown_label") {
    return {
      ...base,
      key: errorKey(error.code),
      params: { labels: base.fields.map((f) => f.replace(/^labels\./, "")).join(", ") },
    };
  }
  return { ...base, key: errorKey(error.code) };
}

export const cacheMinutes = (seconds: number) => Math.max(1, Math.ceil(seconds / 60));
