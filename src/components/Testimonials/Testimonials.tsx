import { Lang } from "need4deed-sdk";
import { PaginatedCards } from "../core/paginatedCards";
import TestimonialCard from "./TestimonialCard";
import fetchTestimonials from "@/hooks/api/testimonials";
import { ScreenTypes } from "@/config/constants";

const cardsPerPageMap = {
  [ScreenTypes.MOBILE]: 1,
  [ScreenTypes.TABLET]: 2,
  [ScreenTypes.DESKTOP]: 3,
};

export default async function Testimonials({ lang }: { lang: Lang }) {
  const testimonials = await fetchTestimonials(lang);

  const cards = testimonials.map((t) => <TestimonialCard {...t} key={t.name} />);

  return (
    <PaginatedCards
      cards={cards}
      arrowButtonColor="orchid-dark"
      bottomIndicatorColor="orchid-dark"
      bottomCurrentIndicatorColor="aubergine-light"
      cardsPerPageMap={cardsPerPageMap}
    />
  );
}
