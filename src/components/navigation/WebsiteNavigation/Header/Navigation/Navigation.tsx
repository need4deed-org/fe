"use client";
import styled from "styled-components";
import { IconButton } from "@/components/navigation/WebsiteNavigation/Header/Navigation/Menu/SecondaryNavigation/IconButton";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useState, type TransitionEvent } from "react";
import { Menu } from "./Menu";
import { InlineNeed4DeedLogo } from "@/components/svg/Need4DeedLogo";

const BREAKPOINT = 1000;

export const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Only animate when the user toggles the menu, not when a breakpoint change
  // makes margin-right jump between the desktop and mobile values.
  const [animating, setAnimating] = useState(false);

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
    <Background>
      <WrapperMenuToggle>
        <IconButton Icon={ListIcon} selected={menuOpen} onClick={() => toggleMenu(true)} />
      </WrapperMenuToggle>
      <OverlayCloseButton $breakpoint={BREAKPOINT} $open={menuOpen} onClick={() => toggleMenu(false)} />
      <MobileMenu $open={menuOpen} $animating={animating} onTransitionEnd={handleTransitionEnd}>
        <Header>
          <IconButton Icon={XIcon} onClick={() => toggleMenu(false)} />
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
    background-color: var(--lavender-40);
    transition: ${({ $animating }) => ($animating ? "margin-right var(--medium-transition)" : "none")};
  }
`;

const Header = styled.header`
  display: none;

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
    fill: var(--lavender-100);
  }
`;

const MenuContainer = styled.div<{ $breakpoint: number }>`
  width: 100%;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex: 1;
  }
`;
