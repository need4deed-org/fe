"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "react-i18next";
import { routes } from "@/constants/routes";
import { LinkButton } from "@/components/fields/LinkButton";

export const AuthButton = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const user = useCurrentUser();

  return user ? (
    <LinkButton href={routes.dashboard(language)} label={t("website.header.dashboard")} />
  ) : (
    <LinkButton href={routes.login(language)} label={t("website.header.login")} />
  );
};
