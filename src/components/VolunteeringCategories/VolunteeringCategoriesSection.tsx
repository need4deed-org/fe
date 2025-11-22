"use client";

import { FullWidthContainer, SectionContainer } from "../styled/container";
import Categories from "./Categories";
import Footer from "./Footer";
import Header from "./Header";

export function VolunteeringCategoriesSection() {
  return (
    <FullWidthContainer
      id="volunteering-categories-fullWidthContainer"
      background-color="var(--color-magnolia)"
    >
      <SectionContainer id="volunteering-categories-container">
        <Header />
        <Categories />
        <Footer />
      </SectionContainer>
    </FullWidthContainer>
  );
}

export default VolunteeringCategoriesSection;
