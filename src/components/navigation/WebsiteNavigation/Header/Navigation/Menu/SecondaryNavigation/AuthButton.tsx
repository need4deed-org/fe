"use client";
import styled from "styled-components";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "react-i18next";
import { routes } from "@/constants/routes";
import { LinkButton } from "@/components/fields/LinkButton";
import Link from "next/link";

export const AuthButton = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const user = useCurrentUser();

  return user ? (
    <Button href={routes.dashboard(language)}>{t("website.header.dashboard")}</Button>
  ) : (
    <Button href={routes.login(language)}>{t("website.header.login")}</Button>
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
  background-color: var(--lavender-100);
  border-radius: var(--field-border-radius);
  font-weight: var(--bold);
  color: var(--white);
  transition: background-color var(--short-transition);

  &:hover,
  &:active,
  &:focus {
    background-color: var(--lavender-80);
  }
`;
