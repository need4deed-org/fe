"use client";
import { AppContainer } from "@/components/styled/container";
import { Hero } from "./Hero";
import { VolunteeringCategoriesSection } from "@/components/VolunteeringCategories";

export function Landing() {
  return (
    <AppContainer id="app-container">
      <Hero />
      <VolunteeringCategoriesSection />
    </AppContainer>
  );
}

export default Landing;
