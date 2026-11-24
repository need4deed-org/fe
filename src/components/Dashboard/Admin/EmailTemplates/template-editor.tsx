"use client";

import { Button } from "@/components/core/button";
import { ErrorMessage, TextArea } from "@/components/core/common";
import { Select } from "@/components/core/common/select";
import { Paragraph } from "@/components/styled/text";
import { useReloadEmailTemplate, useSaveEmailTemplate } from "@/hooks/use-email-templates";
import { ApiEmailTemplateContent, ApiEmailTemplateGet, EmailTemplateLayout, Lang } from "need4deed-sdk";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  cacheMinutes,
  insertAt,
  isDirty,
  isPerLanguageAllowed,
  LANGS,
  placeholderSnippet,
  SaveErrorView,
  switchLayout,
  textOf,
  toSaveContent,
  toSaveErrorView,
  toSingleLine,
  updateLabel,
  updateText,
} from "./helpers";
import { PlaceholderChips } from "./placeholder-chips";

type InsertTarget = { field: "subject" | "text"; element: HTMLTextAreaElement };

type Props = { template: ApiEmailTemplateGet; onDirtyChange: (dirty: boolean) => void };

export function TemplateEditor({ template, onDirtyChange }: Props) {
  const { t } = useTranslation();
  const [base, setBase] = useState(template);
  const [draft, setDraft] = useState(template.template);
  const [seenVersion, setSeenVersion] = useState(template.version);
  const [lang, setLang] = useState(Lang.DE);
  const [error, setError] = useState<SaveErrorView | null>(null);
  const [savedMinutes, setSavedMinutes] = useState<number | null>(null);
  const insertTarget = useRef<InsertTarget | null>(null);

  const readOnly = !base.editable;
  const isPerLanguage = draft.layout === EmailTemplateLayout.PER_LANGUAGE;
  const text = textOf(draft, lang);
  const dirty = isDirty(base.template, draft);
  const isConflict = error?.kind === "conflict";
  const hasNewerVersion = template.version !== base.version;

  if (template.version !== seenVersion) {
    setSeenVersion(template.version);
    if (!dirty && !isConflict) {
      setBase(template);
      setDraft(template.template);
    }
  }

  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const reload = useReloadEmailTemplate();
  const { saveTemplate, isSaving } = useSaveEmailTemplate({
    onSaved: (saved) => {
      setBase(saved);
      setDraft(saved.template);
      setSeenVersion(saved.version);
      setError(null);
      setSavedMinutes(cacheMinutes(saved.cdnCacheSeconds));
    },
    onSaveError: (saveError) => {
      const view = toSaveErrorView(
        saveError,
        base.placeholders.map(({ name }) => name),
      );
      setError(view);
      setSavedMinutes(null);
      if (view.kind === "message" && view.lang) switchLang(view.lang);
    },
  });

  const switchLang = (next: Lang) => {
    insertTarget.current = null;
    setLang(next);
  };

  const edit = (next: ApiEmailTemplateContent) => {
    setDraft(next);
    setSavedMinutes(null);
    if (error?.kind === "message") setError(null);
  };

  const save = () => saveTemplate({ name: base.name, body: { version: base.version, template: toSaveContent(draft) } });

  const loadLatest = () => {
    setBase(template);
    setDraft(template.template);
    setError(null);
  };

  const keepMine = () => {
    setBase(template);
    setError(null);
  };

  const rememberTarget = (field: InsertTarget["field"]) => (event: { currentTarget: HTMLTextAreaElement }) => {
    insertTarget.current = { field, element: event.currentTarget };
  };

  const insertPlaceholder = (name: string) => {
    const target = insertTarget.current;
    const field = target?.field ?? "text";
    const current = text[field];
    const start = target?.element.selectionStart ?? current.length;
    const end = target?.element.selectionEnd ?? current.length;
    const { value, caret } = insertAt(current, start, end, placeholderSnippet(name));
    edit(updateText(draft, lang, { [field]: value }));
    requestAnimationFrame(() => {
      const element = target?.element;
      if (!element?.isConnected) return;
      element.focus();
      element.setSelectionRange(caret, caret);
    });
  };

  const fieldError = (field: string) =>
    error?.kind === "message" &&
    error.fields.includes(field) &&
    (!isPerLanguage || !error.lang || error.lang === lang) ? (
      <ErrorMessage message={t("dashboard.admin.emailTemplates.errors.fieldBlank")} />
    ) : null;

  return (
    <Editor>
      {isPerLanguageAllowed(base.allowedLayouts) && (
        <Field>
          <FieldLabel htmlFor="email-template-layout">{t("dashboard.admin.emailTemplates.layout")}</FieldLabel>
          <Select
            id="email-template-layout"
            value={draft.layout}
            disabled={readOnly}
            onChange={(event) => edit(switchLayout(draft, event.target.value as EmailTemplateLayout, lang))}
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
            <LangTab key={value} type="button" aria-pressed={lang === value} onClick={() => switchLang(value)}>
              {t(`dashboard.admin.emailTemplates.languages.${value}`)}
            </LangTab>
          ))}
        </LangTabs>
      )}

      <Field>
        <TextArea
          label={t("dashboard.admin.emailTemplates.subject")}
          value={text.subject}
          rows={2}
          disabled={readOnly}
          onFocus={rememberTarget("subject")}
          onChange={(value) => edit(updateText(draft, lang, { subject: toSingleLine(value) }))}
        />
        {fieldError("subject")}
      </Field>
      <PlaceholderChips placeholders={base.placeholders} disabled={readOnly} onInsert={insertPlaceholder} />
      <Field>
        <TextArea
          label={t("dashboard.admin.emailTemplates.text")}
          value={text.text}
          rows={16}
          disabled={readOnly}
          onFocus={rememberTarget("text")}
          onChange={(value) => edit(updateText(draft, lang, { text: value }))}
        />
        {fieldError("text")}
      </Field>

      {base.labelKeys.length > 0 && (
        <Field>
          <FieldTitle>{t("dashboard.admin.emailTemplates.labels")}</FieldTitle>
          <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.labelsHint")}</Paragraph>
          {base.labelKeys.map((key) => (
            <Field key={key}>
              <TextArea
                label={t(`dashboard.admin.emailTemplates.labelNames.${key}`, { defaultValue: key })}
                value={text.labels?.[key] ?? ""}
                rows={1}
                disabled={readOnly}
                onFocus={() => {
                  insertTarget.current = null;
                }}
                onChange={(value) => edit(updateLabel(draft, lang, key, toSingleLine(value)))}
              />
              {fieldError(`labels.${key}`)}
            </Field>
          ))}
        </Field>
      )}

      {!readOnly && (
        <Footer>
          {base.hasHtml && (
            <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.hasHtmlWarning")}</Paragraph>
          )}

          {isConflict && (
            <Notice role="alert">
              <Paragraph margin="0">{t("dashboard.admin.emailTemplates.conflict")}</Paragraph>
              {!hasNewerVersion && (
                <Paragraph margin="0" color="var(--color-grey-500)">
                  {t("dashboard.admin.emailTemplates.conflictLoading")}
                </Paragraph>
              )}
              <Actions>
                {!hasNewerVersion && (
                  <Button
                    text={t("dashboard.admin.emailTemplates.checkAgain")}
                    width="auto"
                    onClick={() => reload(base.name)}
                  />
                )}
                <Button
                  text={t("dashboard.admin.emailTemplates.loadLatest")}
                  width="auto"
                  disabled={!hasNewerVersion}
                  onClick={loadLatest}
                />
                <Button
                  text={t("dashboard.admin.emailTemplates.keepMine")}
                  width="auto"
                  backgroundcolor="var(--color-white)"
                  textColor="var(--color-midnight)"
                  border="1px solid var(--color-midnight)"
                  disabled={!hasNewerVersion}
                  onClick={keepMine}
                />
              </Actions>
            </Notice>
          )}

          {error?.kind === "message" && (
            <div role="alert">
              <ErrorMessage
                message={
                  error.lang
                    ? `${t(`dashboard.admin.emailTemplates.languages.${error.lang}`)}: ${t(error.key, error.params)}`
                    : t(error.key, error.params)
                }
              />
            </div>
          )}

          {savedMinutes !== null && (
            <Paragraph role="status" color="var(--color-grey-500)">
              {t("dashboard.admin.emailTemplates.savedNote", { count: savedMinutes })}
            </Paragraph>
          )}

          <Actions>
            <Button
              text={t("dashboard.admin.emailTemplates.save")}
              width="auto"
              disabled={!dirty || isSaving || isConflict}
              onClick={save}
            />
            {dirty && !isConflict && (
              <Button
                text={t("dashboard.admin.emailTemplates.discard")}
                width="auto"
                backgroundcolor="var(--color-white)"
                textColor="var(--color-midnight)"
                border="1px solid var(--color-midnight)"
                disabled={isSaving}
                onClick={() => edit(base.template)}
              />
            )}
          </Actions>
        </Footer>
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

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
`;

const Notice = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
  padding: var(--spacing-16);
  border: 1px solid var(--color-orchid);
  border-radius: var(--border-radius-small);
  background: var(--color-orchid-subtle);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-12);
`;
