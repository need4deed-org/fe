"use client";

import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { Paragraph } from "@/components/styled/text";
import { useEmailTemplates } from "@/hooks/use-email-templates";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export function EmailTemplates() {
  const { t } = useTranslation();
  const { list, isLoading, isError } = useEmailTemplates();

  return (
    <Container>
      <Paragraph>{t("dashboard.admin.emailTemplates.helper")}</Paragraph>
      {isLoading ? (
        <DashboardListLoading />
      ) : isError || !list ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.emailTemplates.loadError")}</Paragraph>
      ) : null}
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
