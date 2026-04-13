"use client";
import { EventsSection } from "@/components/EventsSection";
import { FooterPartnersSection } from "@/components/FooterPartners";
import { Header } from "@/components/Header";
import N4DLogo from "@/components/Layout/PageLayout/logos/N4DLogo";
import { ProcessStepsSection } from "@/components/ProcessSteps";
import { RacSection } from "@/components/RacSection";
import { AppContainer } from "@/components/styled/container";
import { VolunteeringCategoriesSection } from "@/components/VolunteeringCategories";
import { VolunteeringOpportunitiesSection } from "@/components/VolunteeringOpportunities";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { Hero } from "./Hero";

export function Landing() {
  const screenType = useScreenType();
  const isBurgerMenu = screenType === ScreenTypes.MOBILE;
  return (
    <AppContainer id="app-container">
      <Header
        logo={<N4DLogo />}
        isBurgerMenu={isBurgerMenu}
        height="var(--layout-static-page-header-height)"
        padding="var(--layout-static-page-header-padding)"
        menuItemColor="var(--color-midnight)"
      />
      <Hero />
      <VolunteeringCategoriesSection />
      {/* Transferred Components */}
      <VolunteeringOpportunitiesSection />
      <EventsSection />
      <ProcessStepsSection />
      <RacSection />
      {/* Render the existing component like the previous */}
      <FooterPartnersSection />
    </AppContainer>
  );
}
export default Landing;
