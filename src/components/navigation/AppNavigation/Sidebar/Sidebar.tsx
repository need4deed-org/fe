"use client";
import styled from "styled-components";
import { InlineNeed4DeedLogo } from "@/components/svg/Need4DeedLogo";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import NextLink from "next/link";
import { Navigation } from "./Navigation";

type SidebarProps = {
  breakpoint: number;
};

export const Sidebar = ({ breakpoint }: SidebarProps) => {
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <Background $breakpoint={breakpoint}>
      <ContainerLogo $breakpoint={breakpoint}>
        <HomeLink href={ROUTES.home(language)}>
          <InlineNeed4DeedLogo />
        </HomeLink>
      </ContainerLogo>
      <NavigationContainer>
        <Navigation breakpoint={breakpoint} />
      </NavigationContainer>
    </Background>
  );
};

const Background = styled.aside<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  z-index: 2;
  width: var(--sidebar-width);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: var(--misty-lavender);
  border-right: var(--border-width) solid var(--pale-lavender);
  overflow: scroll;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    left: 0;
    top: unset;
    right: 0;
    bottom: 0;
    width: 100%;
    height: var(--mobile-footer-menu-height);
    border: none;
    overflow: visible;
  }
`;

const ContainerLogo = styled.header<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  height: var(--header-height);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: none;
  }
`;

const HomeLink = styled(NextLink)`
  > svg {
    height: var(--header-logo-height);
    fill: var(--blue);
  }

  &:hover > svg,
  &:active > svg,
  &:focus-visible > svg {
    fill: var(--medium-blue);
  }
`;

const NavigationContainer = styled.div`
  flex: 1;
`;
