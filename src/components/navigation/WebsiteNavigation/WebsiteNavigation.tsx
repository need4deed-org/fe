"use client";
import { ReactNode } from "react";
import styled from "styled-components";
import { Footer as Footer1 } from "./Footer1";
import { Header } from "./Header";
import { Footer } from "./Footer";

type WebsiteNavigationProps = {
  children: ReactNode;
};

export const WebsiteNavigation = ({ children }: WebsiteNavigationProps) => {
  return (
    <Frame>
      <Header />
      <PageContainer>{children}</PageContainer>
      <Footer1 />
      <Footer />
    </Frame>
  );
};

const Frame = styled.div`
  padding-top: var(--header-height);
  z-index: 1;
  background: var(--sand-20);
`;

const PageContainer = styled.main``;
