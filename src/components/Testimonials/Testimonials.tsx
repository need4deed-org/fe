import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import useTestimonials from "../../hooks/api/useTestimonials";

import { PaginatedCards } from "../core/paginatedCards";
import TestimonialCard from "./TestimonialCard";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";

const cardsPerPageMap = {
  [ScreenTypes.MOBILE]: 1,
  [ScreenTypes.TABLET]: 2,
  [ScreenTypes.DESKTOP]: 3,
};

export default function Testimonials() {
  const { i18n } = useTranslation();
  const [testimonials] = useTestimonials(i18n.language as Lang);
  const screenType = useScreenType();

  const cards = testimonials.map((t) => <TestimonialCard {...t} key={t.name} />);

  return (
    <PaginatedCards
      cards={cards}
      arrowButtonColor="orchid-dark"
      bottomIndicatorColor="orchid-dark"
      bottomCurrentIndicatorColor="aubergine-light"
      cardsPerPage={cardsPerPageMap[screenType]}
    />
  );
}
