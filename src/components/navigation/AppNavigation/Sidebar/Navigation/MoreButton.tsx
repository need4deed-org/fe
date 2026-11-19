"use client";
import styled from "styled-components";
import { useState } from "react";
import { ListIcon } from "@phosphor-icons/react";
import { MenuLink } from "./Navigation";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

type MoreButtonProps = {
  breakpoint: number;
  links: MenuLink[];
};

export const MoreButton = ({ breakpoint, links }: MoreButtonProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <Container>
      <Button $breakpoint={breakpoint} $selected={menuOpen} onClick={() => setMenuOpen(true)}>
        <ListIcon />
        {t("dashboard.home.sidebar.more")}
      </Button>
      <MenuWrapper $breakpoint={breakpoint} $open={menuOpen}>
        <OverlayCloseButton $breakpoint={breakpoint} onClick={() => setMenuOpen(false)} />
        <Menu $breakpoint={breakpoint}>
          <List>
            {links.map(({ route, Icon, label }) => (
              <ListItem key={route}>
                <Link
                  href={route}
                  $breakpoint={breakpoint}
                  $selected={pathname.startsWith(route)}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon />
                  {label}
                </Link>
              </ListItem>
            ))}
          </List>
        </Menu>
      </MenuWrapper>
    </Container>
  );
};

const Container = styled.li`
  flex: 1;
  z-index: 0;
`;

const Button = styled.button<{ $breakpoint: number; $selected: boolean }>`
  display: none;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: -webkit-flex;
    display: flex;
    gap: var(--very-small-spacing);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--small-spacing);
    width: 100%;
    height: 100%;
    background-color: ${({ $selected }) => ($selected ? "var(--blue-100) !important" : "transparent")};
    border-radius: var(--field-border-radius);
    font-family: var(--condensed-sans-serif);
    font-size: var(--mobile-menu-font-size);
    font-weight: var(--bold);
    color: var(--white);
    text-transform: uppercase;
    transition: background-color var(--short-transition);

    &:hover,
    &:active,
    &:focus {
      background-color: var(--blue-75);
    }

    > svg {
      width: var(--mobile-menu-icon-size);
      height: var(--mobile-menu-icon-size);
      fill: var(--white);
    }
  }
`;

const MenuWrapper = styled.div<{ $breakpoint: number; $open: boolean }>`
  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: absolute;
    top: 0;
    right: 0;
  }
`;

const OverlayCloseButton = styled.button<{ $breakpoint: number }>`
  display: none;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
`;

const Menu = styled.div<{ $breakpoint: number }>`
  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    position: absolute;
    right: var(--small-spacing);
    bottom: var(--small-spacing);
    padding: var(--medium-spacing);
    z-index: 2;
    background-color: var(--blue-50);
    border-radius: var(--surface-border-radius);
  }
`;

const List = styled.ul`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);
`;

const ListItem = styled.li`
  flex: 1;
`;

const Link = styled(NextLink)<{ $breakpoint: number; $selected: boolean }>`
  display: -webkit-inline-flex;
  display: inline-flex;
  align-items: center;
  gap: var(--small-spacing);
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: ${({ $selected }) => ($selected ? "var(--blue-100) !important" : "transparent")};
  border-radius: var(--field-border-radius);
  font-weight: var(--bold);
  color: var(--white);
  white-space: nowrap;
  transition: background-color var(--short-transition);

  &:hover,
  &:active,
  &focus {
    background-color: var(--blue-75);
  }

  > svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    fill: var(--white);
  }

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: -webkit-flex;
    display: flex;
  }
`;
