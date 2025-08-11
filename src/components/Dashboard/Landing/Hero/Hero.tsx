"use client";

import styled from "styled-components";
import { ImageWithGradient } from "../../../core/image";
import HeroContent from "./Content";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { getImageUrl } from "@/utils/helpers";
import { Header } from "../../../Header";
import { FullWidthContainer, OverlayingSectionContainer } from "../../../styled/container";
import N4DLogo from "@/components/Layout/PageLayout/logos/N4DLogo";

const HeroSectionContainer = styled(OverlayingSectionContainer)`
  padding: 0;
`;

const imageNames: Record<ScreenTypes, string> = {
  mobile: "hero_mobile.webp",
  tablet: "hero_tablet.webp",
  desktop: "new-design-hero.webp",
};

export function Hero() {
  const screenType = useScreenType();
  const imageUrl = getImageUrl(imageNames[screenType]);
  const gradientClassName = "image-filter-gradient-blue ";
  const isBurgerMenu = screenType === ScreenTypes.MOBILE;

  return (
    <FullWidthContainer id="HeroSection-FWContainer">
      <ImageWithGradient
        imageUrl={imageUrl}
        gradientClass={gradientClassName}
        height="var(--homepage-hero-section-container-height)"
      />

      <HeroSectionContainer id="hero-section-container">
        <Header
          logo={<N4DLogo />}
          isBurgerMenu={isBurgerMenu}
          height="var(--layout-static-page-header-height)"
          padding="var(--layout-static-page-header-padding)"
          menuItemColor="var(--color-white)"
        />

        <HeroContent />
      </HeroSectionContainer>
    </FullWidthContainer>
  );
}

export default Hero;
