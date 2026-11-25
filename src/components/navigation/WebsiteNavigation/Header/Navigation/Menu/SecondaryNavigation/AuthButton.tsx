"use client";
import styled from "styled-components";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export const AuthButton = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const user = useCurrentUser();

  return user ? (
    <Button href={ROUTES.dashboard(language)}>{t("website.header.dashboard")}</Button>
  ) : (
    <Button href={ROUTES.login(language)}>{t("website.header.login")}</Button>
  );
};

const Button = styled(Link)`
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: var(--blue-100);
  border-radius: var(--pill-field-border-radius);
  font-weight: var(--bold);
  color: var(--white);
  transition: background-color var(--short-transition);

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--blue-80);
  }
`;
