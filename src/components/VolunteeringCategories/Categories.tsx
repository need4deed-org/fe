import { useTranslation } from "react-i18next";
import CategoryCard from "./CategoryCard";
import { Category, IconName } from "./types";
import { PaginatedCards } from "../core/paginatedCards";
import { CategoriesContainer } from "../styled/container";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";

function Categories() {
  const screenType = useScreenType();

  const { t } = useTranslation();

  const categories: Category[] = [
    {
      iconName: IconName.ChatsTeardrop,
      title: t("website.volunteeringCategories.card.germanLanguageSupport"),
      description: t("website.volunteeringCategories.card.germanLanguageSupportInfo"),
    },
    {
      iconName: IconName.Baby,
      title: t("website.volunteeringCategories.card.childcare"),
      description: t("website.volunteeringCategories.card.childcareInfo"),
    },
    {
      iconName: IconName.Bicycle,
      title: t("website.volunteeringCategories.card.skillsBasedVolunteering"),
      description: t("website.volunteeringCategories.card.skillsBasedVolunteeringInfo"),
    },
    {
      iconName: IconName.CalendarStar,
      title: t("website.volunteeringCategories.card.events"),
      description: t("website.volunteeringCategories.card.eventsInfo"),
    },
    {
      iconName: IconName.PingPong,
      title: t("website.volunteeringCategories.card.sportsActivities"),
      description: t("website.volunteeringCategories.card.sportsActivitiesInfo"),
    },
    {
      iconName: IconName.Users,
      title: t("website.volunteeringCategories.card.accompanyARefugee"),
      description: t("website.volunteeringCategories.card.accompanyARefugeeInfo"),
    },
  ];

  const cards = categories.map((category) => <CategoryCard key={category.title} {...category} />);

  return (
    <CategoriesContainer id="categories-container">
      {screenType === ScreenTypes.MOBILE ? (
        <PaginatedCards
          cards={cards}
          arrowButtonColor="orchid-dark"
          bottomIndicatorColor="orchid-dark"
          bottomCurrentIndicatorColor="papaya"
        />
      ) : (
        cards
      )}
    </CategoriesContainer>
  );
}

export default Categories;
