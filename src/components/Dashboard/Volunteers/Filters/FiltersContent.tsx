import { FiltersContentContainer, FullWidthFilter } from "../../common/CardsFilter/Filters";
import { useTranslation } from "react-i18next";
import { QueryParamsKeys } from "need4deed-sdk";
import { VolunteerLanguageMatch } from "./volunteer-language-match";
import { VolunteerCardsFilter } from "./types";
import { createAvailabilityFilterItems, createVolunteerFilterSections } from "./helpers";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { getVisibleSelectionFilterSections } from "../../common/CardsFilter/selectionFilters";
import { SetFilter } from "../../common/CardsFilter/types";
import { ViewMode } from "../../common/types";
import { useAuth } from "@/hooks/useAuth";
import { createCommuteMinutesFilterItems } from "../../common/CardsFilter/matchingPrefill";

interface Props {
  filter: VolunteerCardsFilter;
  setFilter: SetFilter<VolunteerCardsFilter>;
  viewMode: ViewMode;
  isMatchMode: boolean;
}

export default function FiltersContent({ setFilter, filter, viewMode, isMatchMode }: Props) {
  const { t } = useTranslation();
  const { isAuthorized, isAgent, isVolunteer } = useAuth();

  const sections = getVisibleSelectionFilterSections(createVolunteerFilterSections(filter, setFilter, t), {
    viewMode,
    isAuthorized,
    isAgent,
    isVolunteer,
  });
  const availabilityFilters = createAvailabilityFilterItems(filter[QueryParamsKeys.AVAILABILITY], setFilter, t);

  return (
    <FiltersContentContainer>
      {sections.map(({ key, config, items }) => (
        <AccordionFilter
          key={key}
          header={t(config.header)}
          items={items}
          beforeItems={
            key === QueryParamsKeys.LANGUAGE && items.length > 0 ? (
              <VolunteerLanguageMatch
                disabled={!items.some(({ checked }) => checked)}
                matchAllLanguages={filter.matchAllLanguages ?? false}
                setMatchAllLanguages={(matchAllLanguages) =>
                  setFilter((previous) => ({ ...previous, matchAllLanguages }))
                }
                t={t}
              />
            ) : undefined
          }
        />
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
