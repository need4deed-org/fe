"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Id, UserRole } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { StyledLink } from "../styles";

type Props = {
  opportunityId?: Id;
};

export function CreateOpportunityButton({ opportunityId }: Props) {
  const user = useCurrentUser(true);
  const { t, i18n } = useTranslation();

  if (user?.role !== UserRole.AGENT) return null;

  const addOpportunityId = opportunityId ? `?duplicateOpportunityId=${opportunityId}` : "";

  return (
    <StyledLink
      href={`/${i18n.language}/dashboard/opportunities/new${addOpportunityId}`}
      data-testid="create-opportunity-button"
    >
      + {t("dashboard.home.createOpportunity")}
    </StyledLink>
  );
}
