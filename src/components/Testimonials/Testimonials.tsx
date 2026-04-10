import { ScreenTypes } from "@/config/constants";
import { tryCatch } from "@/utils";
import { Lang, Testimonial } from "need4deed-sdk";
import { PaginatedCards } from "../core/paginatedCards";
import TestimonialCard from "./TestimonialCard";
import fetchTestimonials from "./utils";

const cardsPerPageMap = {
  [ScreenTypes.MOBILE]: 1,
  [ScreenTypes.TABLET]: 2,
  [ScreenTypes.DESKTOP]: 3,
};

export default async function Testimonials({ lang }: { lang: Lang }) {
  const [testimonials, error] = await tryCatch(fetchTestimonials(lang));
  if (error) {
    console.error(error);
    return null;
  }

  const cards = testimonials.map((t: Testimonial) => <TestimonialCard {...t} key={t.name} />);

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
