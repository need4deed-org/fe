"use client";

import { Lang, QueryParams } from "need4deed-sdk";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { FooterPartnersSection } from "@/components/FooterPartners";
import { Header } from "@/components/Header";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";

import { N4DLogo } from "./logos/N4DLogo";

interface Props {
  children: ReactNode;
  background?: string;
}

interface PageContentHeaderContainerProps {
  background?: string;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PageContentHeaderContainer = styled.div<PageContentHeaderContainerProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  background: ${(props) =>
    props.background || "var(--layout-static-page-background-default)"};
  padding-bottom: var(--layout-static-page-header-content-bottom-padding);
  padding-top: var(--layout-static-page-header-height);
`;

export function PageLayout({ children, background }: Props) {
  const screenType = useScreenType();
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();

  const isBurgerMenu = screenType !== ScreenTypes.DESKTOP;
  const language = searchParams.get(QueryParams.Language);

  useEffect(() => {
    const isValidLanguage = Object.values(Lang).includes(language as Lang);

    if (isValidLanguage && i18n.language !== language) {
      i18n.changeLanguage(language as Lang);
    }
  }, [language, i18n]);

  return (
    <PageContainer>
      <PageContentHeaderContainer background={background}>
        <Header
          logo={<N4DLogo />}
          isBurgerMenu={isBurgerMenu}
          height="var(--layout-static-page-header-height)"
          padding="var(--layout-static-page-header-padding)"
          menuItemColor="var(--color-midnight)"
        />
        {children}
      </PageContentHeaderContainer>
      <FooterPartnersSection />
    </PageContainer>
  );
}

export default PageLayout;
