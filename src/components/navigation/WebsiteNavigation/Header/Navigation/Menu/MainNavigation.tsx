"use client";
import styled from "styled-components";
import { ROUTES } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Link } from "@/types/Link";
import NextLink from "next/link";

type MainNavigationProps = {
  breakpoint: number;
};

export const MainNavigation = ({ breakpoint }: MainNavigationProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const pathname = usePathname();
  const links: Link[] = [
    { route: ROUTES.about(language), label: t("website.header.about") },
    { route: ROUTES.volunteer(language), label: t("website.header.volunteer") },
    { route: ROUTES.events(language), label: t("website.header.events") },
  ];

  return (
    <Background aria-label={t("website.header.mainNavigation")}>
      <List $breakpoint={breakpoint}>
        {links.map(({ route, label }) => (
          <ListItem key={route}>
            <LinkElement
              href={route}
              aria-current={route === pathname ? "page" : undefined}
              $selected={route === pathname}
            >
              {label}
            </LinkElement>
          </ListItem>
        ))}
      </List>
    </Background>
  );
};

const Background = styled.nav``;

const List = styled.ul<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  gap: var(--medium-spacing);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex-direction: column;
  }
`;

const ListItem = styled.li``;

const LinkElement = styled(NextLink)<{ $selected: boolean }>`
  background-color: ${({ $selected }) => ($selected ? "var(--blue-100) !important" : "transparent")};
  font-weight: var(--bold);
  color: ${({ $selected }) => ($selected ? "var(--white) !important" : "var(--blue-100)")};
  text-transform: capitalize;
  transition: var(--short-transition);

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--blue-80);
    color: var(--white);
  }
`;
