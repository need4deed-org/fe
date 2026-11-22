"use client";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import NextLink from "next/link";
import { routes } from "@/constants/routes";
import { InlineNeed4DeedLogo } from "@/components/svg/Need4DeedLogo";
import { Navigation } from "./Navigation";

export const Header = () => {
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <HeaderElement>
      <HomeLink href={routes.home(language)}>
        <InlineNeed4DeedLogo />
      </HomeLink>
      <Navigation />
    </HeaderElement>
  );
};

const HeaderElement = styled.header`
  display: -webkit-flex;
  display: flex;
  align-items: center;
  gap: var(--medium-spacing);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 2;
  height: var(--header-height);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: var(--lavender-100);
`;

const HomeLink = styled(NextLink)`
  svg {
    height: var(--header-logo-height);
    fill: var(--white);
    transition: var(--short-transition);
  }

  &:hover > svg,
  &:active > svg,
  &:focus-visible > svg {
    fill: var(--lavender-20);
  }
`;
