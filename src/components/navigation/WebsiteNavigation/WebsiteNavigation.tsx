"use client";
import { ReactNode } from "react";
import styled from "styled-components";
import { Footer } from "./Footer";
import { Header } from "./Header";

type WebsiteNavigationProps = {
  children: ReactNode;
};

export const WebsiteNavigation = ({ children }: WebsiteNavigationProps) => {
  return (
    <Frame>
      <Header />
      <PageContainer>{children}</PageContainer>
      <Footer />
    </Frame>
  );
};

const Frame = styled.div`
  padding-top: var(--header-height);
  z-index: 1;
  background: var(--sand-25);
`;

const PageContainer = styled.main``;
