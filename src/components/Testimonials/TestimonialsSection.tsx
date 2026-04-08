import { Lang } from "need4deed-sdk";
import { FullWidthContainer, SectionContainer } from "../styled/container";
import Header from "./Header";
import Testimonials from "./Testimonials";

export function TestimonialsSection({ lang }: { lang: Lang }) {
  return (
    <FullWidthContainer id="testimonials-fullWidthContainer" background-color="var(--color-magnolia)">
      <SectionContainer id="testimonials-container">
        <Header />
        <Testimonials lang={lang} />
      </SectionContainer>
    </FullWidthContainer>
  );
}

export default TestimonialsSection;
