"use client";

import { Select } from "@/components/core/common/select";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { Paragraph } from "@/components/styled/text";
import { useEmailTemplates } from "@/hooks/use-email-templates";
import { EmailTemplateName } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { isTemplateName, sortByLabel, templateLabelKey } from "./helpers";

export function EmailTemplates() {
  const { t, i18n } = useTranslation();
  const { list, isLoading, isError } = useEmailTemplates();
  const [selected, setSelected] = useState<EmailTemplateName>();

  if (isLoading) return <DashboardListLoading />;
  if (isError || !list) {
    return <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.loadError")}</Paragraph>;
  }

  const labelOf = (name: EmailTemplateName) => t(templateLabelKey(name));
  const templates = sortByLabel(list.templates, labelOf, i18n.language);

  return (
    <Container>
      <Paragraph>{t("dashboard.admin.emailTemplates.helper")}</Paragraph>
      {!list.editable && (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.readOnly")}</Paragraph>
      )}

      <Select
        aria-label={t("dashboard.admin.emailTemplates.template")}
        value={selected ?? ""}
        onChange={(event) => {
          const { value } = event.target;
          if (isTemplateName(value)) setSelected(value);
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
    </Container>
  );
}

export default EmailTemplates;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  max-width: 960px;
`;
