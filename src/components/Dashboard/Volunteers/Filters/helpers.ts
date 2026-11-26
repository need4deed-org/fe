import { TFunction } from "i18next";
import { Availability, VolunteerCardsFilter } from "./types";
import {
  createSelectionFilterSections,
  getSelectedSelectionFilterItems,
} from "../../common/CardsFilter/selectionFilters";
import { SelectionMap, SetFilter } from "../../common/CardsFilter/types";
import { QueryParamsKeys } from "need4deed-sdk";
import { volunteerFilterConfigs } from "./config";
import { createCommutePrefillItem } from "../../common/CardsFilter/matchingPrefill";
import { getClearFilter } from "../../common/CardsFilter/helpers";

export const createVolunteerFilterSections = (
  filter: VolunteerCardsFilter,
  setFilter: SetFilter<VolunteerCardsFilter>,
  t: TFunction,
) => createSelectionFilterSections(volunteerFilterConfigs, filter, setFilter, t);

export const createAvailabilityFilterItems = (
  availability: Availability,
  setFilter: SetFilter<VolunteerCardsFilter>,
  t: TFunction,
) => {
  const { days, times, occasional } = availability;

  const createAvailabilityGroup = <K extends keyof Availability, T extends SelectionMap>(labelKey: K, obj: T) => ({
    label: t(`dashboard.volunteers.filters.preferredAv.${labelKey}.header`),
    items: Object.keys(obj).map((key) => ({
      label: t(`dashboard.volunteers.filters.preferredAv.${labelKey}.${key}`),
      checked: obj[key],
      onChange: (checked: boolean) => {
        const updated = { ...obj, [key]: checked };
        setFilter((prev) => ({
          ...prev,
          [QueryParamsKeys.AVAILABILITY]: { ...availability, [labelKey]: updated },
        }));
      },
      keyValue: key,
      parentKey: QueryParamsKeys.AVAILABILITY,
    })),
  });

  return [
    createAvailabilityGroup("days", days),
    createAvailabilityGroup("times", times),
    createAvailabilityGroup("occasional", occasional),
  ];
};

export const createSelectedFilterItemsAsFlatArray = (
  filter: VolunteerCardsFilter,
  setFilter: SetFilter<VolunteerCardsFilter>,
  t: TFunction,
) => {
  const sections = createVolunteerFilterSections(filter, setFilter, t);
  const availabilityItems = createAvailabilityFilterItems(filter[QueryParamsKeys.AVAILABILITY], setFilter, t)
    .flatMap(({ items }) => items)
    .filter((item) => item.checked);
  const commuteItem = createCommutePrefillItem(filter, setFilter, t, QueryParamsKeys.COMMUTE_OPPORTUNITY_ID);
  const selectedItems = getSelectedSelectionFilterItems(sections);
  const languages = selectedItems.filter((item) => item.parentKey === QueryParamsKeys.LANGUAGE);
  if (languages.length > 1) {
    const conjunction = t(`dashboard.volunteers.languageMatch.${filter.matchAllLanguages ? "and" : "or"}`);
    const names = languages.map((item) => item.label).join(` ${conjunction} `);
    selectedItems.splice(selectedItems.indexOf(languages[0]), languages.length, {
      keyValue: QueryParamsKeys.LANGUAGE,
      label: names,
      checked: true,
      onChange: () => setFilter((previous) => ({ ...previous, language: getClearFilter(previous.language) })),
    });
  }
  return [...selectedItems, ...availabilityItems, ...(commuteItem ? [commuteItem] : [])];
};
