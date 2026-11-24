import {
  ApiEmailTemplateContent,
  ApiEmailTemplateLayouts,
  ApiEmailTemplateListItem,
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
