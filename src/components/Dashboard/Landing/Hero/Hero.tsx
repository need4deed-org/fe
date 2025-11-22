"use client";

import styled from "styled-components";

import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { getImageUrl } from "@/utils/helpers";

import { ImageWithGradient } from "../../../core/image";
import {
  FullWidthContainer,
  OverlayingSectionContainer,
} from "../../../styled/container";
import HeroContent from "./Content";

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

  return (
    <FullWidthContainer id="HeroSection-FWContainer">
      <ImageWithGradient
        imageUrl={imageUrl}
        gradientClass={gradientClassName}
        height="var(--homepage-hero-section-container-height)"
      />

      <HeroSectionContainer id="hero-section-container">
        <HeroContent />
      </HeroSectionContainer>
    </FullWidthContainer>
  );
}

export default Hero;
