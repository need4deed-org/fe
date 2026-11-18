"use client";
import styled from "styled-components";
import { IconButton } from "@/components/fields/IconButton";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Menu } from "./Menu";
import { InlineNeed4DeedLogo } from "@/components/svg/Need4DeedLogo";

const BREAKPOINT = 1000;

export const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Background>
      <WrapperMenuToggle>
        <IconButton Icon={ListIcon} selected={menuOpen} onClick={() => setMenuOpen(true)} />
      </WrapperMenuToggle>
      <MobileMenu $open={menuOpen}>
        <Header>
          <IconButton Icon={XIcon} onClick={() => setMenuOpen(false)} />
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

const MobileMenu = styled.div<{ $open: boolean }>`
  display: -webkit-flex;
  display: flex;
  gap: var(--medium-spacing);
  flex: 1;
  width: 100%;

  @media screen and (max-width: ${BREAKPOINT}px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    gap: 0;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: var(--mobile-menu-width);
    max-width: 100%;
    background-color: var(--blue-25);
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
    fill: var(--blue-100);
  }
`;

const MenuContainer = styled.div<{ $breakpoint: number }>`
  width: 100%;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex: 1;
  }
`;
