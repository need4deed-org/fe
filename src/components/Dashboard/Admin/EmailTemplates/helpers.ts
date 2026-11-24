import { ApiEmailTemplateListItem, EmailTemplateName } from "need4deed-sdk";

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
