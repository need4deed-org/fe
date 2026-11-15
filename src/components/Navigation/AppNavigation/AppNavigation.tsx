import { ReactNode } from "react";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";

type AppNavigationProps = {
  children: ReactNode;
};

const BREAKPOINT = 1000;

export const AppNavigation = ({ children }: AppNavigationProps) => {
  return (
    <Frame>
      <Sidebar breakpoint={BREAKPOINT} />
      <PageContainer>{children}</PageContainer>
    </Frame>
  );
};

const Frame = styled.div`
  display: -webkit-flex;
  display: flex;
  padding-left: var(--sidebar-width);
  background: var(--sand-25);

  @media screen and (max-width: ${BREAKPOINT}px) {
    display: block;
    padding: 0;
    padding-bottom: var(--mobile-footer-menu-height);
  }
`;

const PageContainer = styled.main`
  width: 100%;
  min-height: 100vh;
`;
