import { EventsSection } from "@/components/EventsSection";
import { ProcessStepsSection } from "@/components/ProcessSteps";
import { TestimonialsSection } from "@/components/Testimonials";
import { VolunteeringCategoriesSection } from "@/components/VolunteeringCategories";
import { Lang } from "need4deed-sdk";
import { Hero } from "./Hero";

export function Landing({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero />
      <VolunteeringCategoriesSection />
      <EventsSection />
      <TestimonialsSection lang={lang} />
      <ProcessStepsSection />
    </>
  );
}
export default Landing;
