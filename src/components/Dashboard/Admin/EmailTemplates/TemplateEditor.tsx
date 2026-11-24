"use client";

import { TextArea } from "@/components/core/common";
import { Select } from "@/components/core/common/select";
import { Paragraph } from "@/components/styled/text";
import { ApiEmailTemplateGet, EmailTemplateLayout, Lang } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { isPerLanguageAllowed, LANGS, switchLayout, textOf, toSingleLine, updateLabel, updateText } from "./helpers";

type Props = { template: ApiEmailTemplateGet };

export function TemplateEditor({ template }: Props) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(template.template);
  const [lang, setLang] = useState(Lang.DE);
  const readOnly = !template.editable;
  const isPerLanguage = draft.layout === EmailTemplateLayout.PER_LANGUAGE;
  const text = textOf(draft, lang);

  return (
    <Editor>
      {isPerLanguageAllowed(template.allowedLayouts) && (
        <Field>
          <FieldLabel htmlFor="email-template-layout">{t("dashboard.admin.emailTemplates.layout")}</FieldLabel>
          <Select
            id="email-template-layout"
            value={draft.layout}
            disabled={readOnly}
            onChange={(event) => setDraft(switchLayout(draft, event.target.value as EmailTemplateLayout))}
          >
            <option value={EmailTemplateLayout.SINGLE}>{t("dashboard.admin.emailTemplates.layoutSingle")}</option>
            <option value={EmailTemplateLayout.PER_LANGUAGE}>
              {t("dashboard.admin.emailTemplates.layoutPerLanguage")}
            </option>
          </Select>
          <Paragraph color="var(--color-grey-500)">
            {t(
              isPerLanguage
                ? "dashboard.admin.emailTemplates.layoutPerLanguageHint"
                : "dashboard.admin.emailTemplates.layoutSingleHint",
            )}
          </Paragraph>
        </Field>
      )}

      {isPerLanguage && (
        <LangTabs role="group" aria-label={t("dashboard.admin.emailTemplates.language")}>
          {LANGS.map((value) => (
            <LangTab key={value} type="button" aria-pressed={lang === value} onClick={() => setLang(value)}>
              {t(`dashboard.admin.emailTemplates.languages.${value}`)}
            </LangTab>
          ))}
        </LangTabs>
      )}

      <TextArea
        label={t("dashboard.admin.emailTemplates.subject")}
        value={text.subject}
        rows={2}
        disabled={readOnly}
        onChange={(value) => setDraft(updateText(draft, lang, { subject: toSingleLine(value) }))}
      />
      <TextArea
        label={t("dashboard.admin.emailTemplates.text")}
        value={text.text}
        rows={16}
        disabled={readOnly}
        onChange={(value) => setDraft(updateText(draft, lang, { text: value }))}
      />

      {template.labelKeys.length > 0 && (
        <Field>
          <FieldTitle>{t("dashboard.admin.emailTemplates.labels")}</FieldTitle>
          <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.labelsHint")}</Paragraph>
          {template.labelKeys.map((key) => (
            <TextArea
              key={key}
              label={t(`dashboard.admin.emailTemplates.labelNames.${key}`, { defaultValue: key })}
              value={text.labels?.[key] ?? ""}
              rows={1}
              disabled={readOnly}
              onChange={(value) => setDraft(updateLabel(draft, lang, key, toSingleLine(value)))}
            />
          ))}
        </Field>
      )}
    </Editor>
  );
}

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const FieldLabel = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-midnight);
`;

const FieldTitle = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-midnight);
`;

const LangTabs = styled.div`
  display: flex;
  gap: var(--spacing-8);
`;

const LangTab = styled.button`
  padding: var(--spacing-8) var(--spacing-16);
  border-radius: var(--button-border-radius);
  border: 1px solid var(--color-orchid);
  background: transparent;
  color: var(--color-midnight);
  font-size: var(--text-p-font-size);
  font-weight: var(--font-weight-semi-bold);
  cursor: pointer;

  &[aria-pressed="true"] {
    background: var(--color-orchid);
  }

  &:hover {
    background: var(--color-orchid-subtle);
  }
`;
