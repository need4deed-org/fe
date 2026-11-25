"use client";
import styled from "styled-components";
import { IconButton } from "@/components/navigation/WebsiteNavigation/Header/Navigation/Menu/SecondaryNavigation/IconButton";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type TransitionEvent } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "./Menu";
import { InlineNeed4DeedLogo } from "@/components/svg/Need4DeedLogo";

const BREAKPOINT = 1000;
const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null);

export const Navigation = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  // Only animate when the user toggles the menu, not when a breakpoint change
  // makes margin-right jump between the desktop and mobile values.
  const [animating, setAnimating] = useState(false);
  const mobileMenuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef(false);

  useEffect(() => {
    if (menuOpen) {
      const menu = mobileMenuRef.current;
      if (menu) getFocusableElements(menu)[0]?.focus({ preventScroll: true });
    } else if (wasMenuOpenRef.current) {
      menuToggleRef.current?.focus();
    }
    wasMenuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    const root = rootRef.current;
    if (!menuOpen || !root) return;

    const inertElements: HTMLElement[] = [];
    for (let node: HTMLElement = root; node.parentElement && node !== document.body; node = node.parentElement) {
      for (const sibling of Array.from(node.parentElement.children)) {
        if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert) {
          sibling.inert = true;
          inertElements.push(sibling);
        }
      }
    }

    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINT}px)`);
    const closeOnDesktop = () => {
      if (!mobileQuery.matches) setMenuOpen(false);
    };
    mobileQuery.addEventListener("change", closeOnDesktop);

    return () => {
      inertElements.forEach((el) => (el.inert = false));
      mobileQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const trapFocus = (e: KeyboardEvent) => {
      const menu = mobileMenuRef.current;
      if (!menu) return;

      const focusable = getFocusableElements(menu);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!menu.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAnimating(true);
        setMenuOpen(false);
      } else if (e.key === "Tab") {
        trapFocus(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const toggleMenu = (open: boolean) => {
    setAnimating(true);
    setMenuOpen(open);
  };

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.propertyName === "margin-right") {
      setAnimating(false);
    }
  };

  return (
    <Background ref={rootRef}>
      <WrapperMenuToggle>
        <IconButton
          ref={menuToggleRef}
          Icon={ListIcon}
          label={t("website.header.openMenu")}
          selected={menuOpen}
          expanded={menuOpen}
          controls={mobileMenuId}
          onClick={() => toggleMenu(true)}
        />
      </WrapperMenuToggle>
      <OverlayCloseButton
        type="button"
        tabIndex={-1}
        aria-hidden
        $breakpoint={BREAKPOINT}
        $open={menuOpen}
        onClick={() => toggleMenu(false)}
      />
      <MobileMenu
        ref={mobileMenuRef}
        id={mobileMenuId}
        $open={menuOpen}
        $animating={animating}
        onTransitionEnd={handleTransitionEnd}
      >
        <Header>
          <IconButton Icon={XIcon} label={t("website.header.closeMenu")} onClick={() => toggleMenu(false)} />
          <LogoContainer>
            <InlineNeed4DeedLogo />
          </LogoContainer>
        </Header>
        <MenuContainer $breakpoint={BREAKPOINT}>
          <Menu breakpoint={BREAKPOINT} />
        </MenuContainer>
      </MobileMenu>
    </Background>
  );
};

const Background = styled.div`
  flex: 1;
  z-index: 0;

  @media screen and (max-width: ${BREAKPOINT}px) {
    display: -webkit-flex;
    display: flex;
    justify-content: flex-end;
  }
`;

const WrapperMenuToggle = styled.div`
  display: none;

  @media screen and (max-width: ${BREAKPOINT}px) {
    display: block;
  }
`;

const OverlayCloseButton = styled.button<{ $breakpoint: number; $open: boolean }>`
  display: none;
  z-index: 1;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
`;

const MobileMenu = styled.div<{ $open: boolean; $animating: boolean }>`
  display: -webkit-flex;
  display: flex;
  gap: var(--medium-spacing);
  flex: 1;
  z-index: 2;
  width: 100%;

  @media screen and (max-width: ${BREAKPOINT}px) {
    flex-direction: column;
    gap: 0;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: var(--mobile-menu-width);
    max-width: 100%;
    margin-right: ${({ $open }) => ($open ? "0" : "calc(var(--mobile-menu-width) * -1)")};
    background-color: var(--lavender-20);
    border-left: var(--border-width) solid var(--lavender-40);
    overflow: scroll;
    transition: ${({ $animating }) => ($animating ? "margin-right var(--medium-transition)" : "none")};
  }
`;

const Header = styled.header`
  display: none;
  flex-shrink: 0;

  @media screen and (max-width: ${BREAKPOINT}px) {
    display: -webkit-flex;
    display: flex;
    gap: var(--medium-spacing);
    align-items: center;
    width: 100%;
    height: var(--header-height);
    padding-left: var(--large-spacing);
    padding-right: var(--large-spacing);
  }
`;

const LogoContainer = styled.div`
  display: -webkit-flex;
  display: flex;
  flex: 1;
  justify-content: center;

  svg {
    height: var(--mobile-menu-logo-height);
    fill: var(--blue-100);
  }
`;

const MenuContainer = styled.div<{ $breakpoint: number }>`
  width: 100%;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex: 1;
  }
`;
