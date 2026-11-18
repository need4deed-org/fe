"use client";
import styled from "styled-components";
import { routes } from "@/constants/routes";
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
    { route: routes.about(language), label: t("website.header.about") },
    { route: routes.volunteer(language), label: t("website.header.volunteer") },
    { route: routes.events(language), label: t("website.header.events") },
  ];

  return (
    <Background area-label="Main Navigation">
      <List $breakpoint={breakpoint}>
        {links.map(({ route, label }) => (
          <ListItem key={route}>
            <LinkElement href={route} $selected={route === pathname}>
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
  font-weight: var(--bold);
  color: ${({ $selected }) => ($selected ? "var(--blue-100) !important" : "var(--white)")};
  text-transform: capitalize;
  transition: var(--short-transition);

  &:hover,
  &:active,
  &:focus {
    color: var(--blue-75);
  }
`;
