"use client";
import { routes } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { StyledLink } from "../styles";

export function CreateOpportunityButton() {
  const user = useCurrentUser(true);
  const { t, i18n } = useTranslation();

  if (user?.role !== UserRole.AGENT) return null;

  return <StyledLink href={routes.newOpportunity(i18n.language)}>+ {t("dashboard.home.createOpportunity")}</StyledLink>;
}
