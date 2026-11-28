"use client";

import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { Select } from "@/components/core/common/select";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { Paragraph } from "@/components/styled/text";
import { Button } from "@/components/core/button";
import { useEmailTemplate, useEmailTemplates, useReloadEmailTemplate } from "@/hooks/use-email-templates";
import { EmailTemplateName } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { inAppPathOf, isTemplateName, sortByLabel, templateLabelKey } from "./helpers";
import { TemplateEditor } from "./template-editor";

type Pending = { template: EmailTemplateName } | { path: string };

export function EmailTemplates() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { list, isLoading } = useEmailTemplates();
  const [selected, setSelected] = useState<EmailTemplateName>();
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const reload = useReloadEmailTemplate();
  const [pending, setPending] = useState<Pending>();
  const { template, isLoading: isTemplateLoading } = useEmailTemplate(selected);

  useEffect(() => {
    if (!dirty && !saving) return;
    const confirmLeaving = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      const path = inAppPathOf(anchor.href, window.location.href);
      if (path === null) return;
      event.preventDefault();
      if (!saving) setPending({ path });
    };
    document.addEventListener("click", confirmLeaving, true);
    return () => document.removeEventListener("click", confirmLeaving, true);
  }, [dirty, saving]);

  if (isLoading) return <DashboardListLoading />;
  if (!list) {
    return <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.loadError")}</Paragraph>;
  }

  const labelOf = (name: EmailTemplateName) => t(templateLabelKey(name));
  const templates = sortByLabel(
    list.templates.filter(({ name }) => isTemplateName(name)),
    labelOf,
    i18n.language,
  );

  const confirmPending = () => {
    if (!pending) return;
    setDirty(false);
    setPending(undefined);
    if ("template" in pending) setSelected(pending.template);
    else router.push(pending.path);
  };

  return (
    <Container>
      <Paragraph>{t("dashboard.admin.emailTemplates.helper")}</Paragraph>
      {!list.editable && (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.readOnly")}</Paragraph>
      )}

      <Select
        aria-label={t("dashboard.admin.emailTemplates.template")}
        value={selected ?? ""}
        disabled={saving}
        onChange={(event) => {
          const { value } = event.target;
          if (!isTemplateName(value)) return;
          if (dirty) setPending({ template: value });
          else setSelected(value);
        }}
      >
        <option value="" disabled>
          {t("dashboard.admin.emailTemplates.choose")}
        </option>
        {templates.map(({ name }) => (
          <option key={name} value={name}>
            {labelOf(name)}
          </option>
        ))}
      </Select>

      {selected &&
        (template ? (
          <TemplateEditor key={template.name} template={template} onDirtyChange={setDirty} onSavingChange={setSaving} />
        ) : isTemplateLoading ? (
          <DashboardListLoading />
        ) : (
          <LoadError>
            <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.templateLoadError")}</Paragraph>
            <Button text={t("dashboard.admin.emailTemplates.retry")} width="auto" onClick={() => reload(selected)} />
          </LoadError>
        ))}

      {pending && (
        <ConfirmationDialog
          title={t("dashboard.admin.emailTemplates.unsavedTitle")}
          message={t(
            "template" in pending
              ? "dashboard.admin.emailTemplates.unsavedMessage"
              : "dashboard.admin.emailTemplates.unsavedLeaveMessage",
          )}
          confirmText={t(
            "template" in pending
              ? "dashboard.admin.emailTemplates.unsavedConfirm"
              : "dashboard.admin.emailTemplates.unsavedLeaveConfirm",
          )}
          onCancel={() => setPending(undefined)}
          onConfirm={confirmPending}
        />
      )}
    </Container>
  );
}

export default EmailTemplates;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  max-width: 960px;
  padding: var(--large-spacing);
`;

const LoadError = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-12);
`;
