import { ScreenTypes } from "@/config/constants";
import { Lang } from "need4deed-sdk";
import { PaginatedCards } from "../core/paginatedCards";
import TestimonialCard from "./TestimonialCard";
import fetchTestimonials from "./utils";
import { useQuery } from "@tanstack/react-query";

const cardsPerPageMap = {
  [ScreenTypes.MOBILE]: 1,
  [ScreenTypes.TABLET]: 2,
  [ScreenTypes.DESKTOP]: 3,
};

export default function Testimonials({ lang }: { lang: Lang }) {
  const {
    data: testimonials,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testimonials", lang],
    queryFn: () => fetchTestimonials(lang),
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !testimonials) return null;

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
