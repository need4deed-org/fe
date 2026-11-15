"use client";
import styled from "styled-components";
import { MainNavigation } from "./MainNavigation";
import { SecondaryNavigation } from "./SecondaryNavigation";

type MenuProps = {
  breakpoint: number;
};

export const Menu = ({ breakpoint }: MenuProps) => {
  return (
    <Background $breakpoint={breakpoint}>
      <MainNavigationContainer $breakpoint={breakpoint}>
        <MainNavigation breakpoint={breakpoint} />
      </MainNavigationContainer>
      <SecondaryNavigation breakpoint={breakpoint} />
    </Background>
  );
};

const Background = styled.div<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  gap: var(--medium-spacing);
  width: 100%;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex-direction: column;
    height: 100%;
    padding: var(--large-spacing);
  }
`;

const MainNavigationContainer = styled.div<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    justify-content: flex-start;
  }
`;
