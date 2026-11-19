import { FiltersContentContainer, FullWidthFilter } from "../../common/CardsFilter/Filters";
import { useTranslation } from "react-i18next";
import { QueryParamsKeys } from "need4deed-sdk";
import { VolunteerCardsFilter } from "./types";
import { createAvailabilityFilterItems, createVolunteerFilterSections } from "./helpers";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { getVisibleSelectionFilterSections } from "../../common/CardsFilter/selectionFilters";
import { SetFilter } from "../../common/CardsFilter/types";
import { useAuth } from "@/hooks/useAuth";
import { createCommuteMinutesFilterItems } from "../../common/CardsFilter/matchingPrefill";

interface Props {
  filter: VolunteerCardsFilter;
  setFilter: SetFilter<VolunteerCardsFilter>;
  isMatchMode: boolean;
}

export default function FiltersContent({ setFilter, filter, isMatchMode }: Props) {
  const { t } = useTranslation();
  const { isAuthorized, isAgent, isVolunteer } = useAuth();

  const sections = getVisibleSelectionFilterSections(createVolunteerFilterSections(filter, setFilter, t), {
    isAuthorized,
    isAgent,
    isVolunteer,
  });
  const availabilityFilters = createAvailabilityFilterItems(filter[QueryParamsKeys.AVAILABILITY], setFilter, t);

  return (
    <FiltersContentContainer>
      {sections.map(({ key, config, items }) => (
        <AccordionFilter key={key} header={t(config.header)} items={items} />
      ))}
      {isMatchMode && filter.hasCommuteSource && (
        <AccordionFilter
          header={t("dashboard.filters.commuteMinutesHeader")}
          items={createCommuteMinutesFilterItems(filter, setFilter, t)}
        />
      )}
      <FullWidthFilter
        header={t("dashboard.volunteers.filters.preferredAv.header")}
        groupedItems={availabilityFilters}
        groupedItemsDisplayType="button"
      />
    </FiltersContentContainer>
  );
}
