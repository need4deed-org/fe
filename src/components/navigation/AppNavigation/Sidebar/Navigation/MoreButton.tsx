"use client";
import styled from "styled-components";
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
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
  const listId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    listRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();

    const mobileQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const closeOnDesktop = () => {
      if (!mobileQuery.matches) setMenuOpen(false);
    };
    mobileQuery.addEventListener("change", closeOnDesktop);
    return () => mobileQuery.removeEventListener("change", closeOnDesktop);
  }, [menuOpen, breakpoint]);

  const closeAndFocusToggle = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if (menuOpen && e.key === "Escape") {
      e.stopPropagation();
      closeAndFocusToggle();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setMenuOpen(false);
    }
  };

  return (
    <Container onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <Button
        ref={toggleRef}
        type="button"
        aria-expanded={menuOpen}
        aria-controls={listId}
        $breakpoint={breakpoint}
        $selected={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <ListIcon aria-hidden />
        {t("dashboard.home.sidebar.more")}
      </Button>
      <MenuWrapper $breakpoint={breakpoint} $open={menuOpen}>
        <OverlayCloseButton
          type="button"
          tabIndex={-1}
          aria-hidden
          $breakpoint={breakpoint}
          onClick={closeAndFocusToggle}
        />
        <Menu $breakpoint={breakpoint}>
          <List ref={listRef} id={listId}>
            {links.map(({ route, Icon, label }) => {
              const selected = pathname.startsWith(route);
              return (
                <ListItem key={route}>
                  <Link
                    href={route}
                    aria-current={selected ? "page" : undefined}
                    $breakpoint={breakpoint}
                    $selected={selected}
                    onClick={closeAndFocusToggle}
                  >
                    <Icon aria-hidden />
                    {label}
                  </Link>
                </ListItem>
              );
            })}
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
    color: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue-100)")};
    text-transform: uppercase;
    transition:
      background-color var(--short-transition),
      color var(--short-transition);

    &:hover,
    &:active,
    &:focus-visible {
      background-color: var(--blue-80);
      color: var(--white);
    }

    > svg {
      width: var(--mobile-menu-icon-size);
      height: var(--mobile-menu-icon-size);
      fill: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue-100)")};
      transition: fill var(--short-transition);
    }

    &:hover > svg,
    &:active > svg,
    &:focus-visible > svg {
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
    background-color: var(--blue-20);
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
  border-radius: var(--pill-field-border-radius);
  font-weight: var(--bold);
  color: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue-100)")};
  white-space: nowrap;
  transition:
    background-color var(--short-transition),
    color var(--short-transition);

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--blue-80);
    color: var(--white);
  }

  > svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    fill: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue-100)")};
    transition: fill var(--short-transition);
  }

  &:hover > svg,
  &:active > svg,
  &:focus-visible > svg {
    fill: var(--white);
  }

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: -webkit-flex;
    display: flex;
    border-radius: var(--field-border-radius);
  }
`;
