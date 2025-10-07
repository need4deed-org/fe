import { TFunction } from "i18next";
import { Availability, CardsFilter, SelectionMap, SetFilter } from "./types";
import { FilterKeys } from "./constants";

export const getClearFilter = (filter: object) => {
  const newFilter: Record<string, string | boolean | object> = {};

  for (const [key, val] of Object.entries(filter)) {
    if (typeof val === "boolean") newFilter[key] = false;
    else if (typeof val === "string") newFilter[key] = "";
    else if (typeof val === "object") newFilter[key] = getClearFilter(val);
    else throw new Error("Unsupported type to clear the filter");
  }

  return newFilter;
};

/**
 * Generic helper to create a list of checkbox-like filter items from a record of booleans.
 */
const createFilterList = <T extends SelectionMap>(
  obj: T,
  setFilter: SetFilter,
  key: FilterKeys,
  labelResolver: (key: string) => string,
) =>
  Object.keys(obj)
    .sort()
    .map((k) => ({
      label: labelResolver(k),
      checked: obj[k],
      onChange: (checked: boolean) => {
        const updated = { ...obj, [k]: checked };
        setFilter((prev) => ({ ...prev, [key]: updated }));
      },
    }));

/**
 * Creates filter items for districts, languages, engagement, and availability.
 */
export const createFilterItems = (filter: CardsFilter, setFilter: SetFilter, t: TFunction) => {
  const districtFilter = createFilterList(filter[FilterKeys.DISTRICT], setFilter, FilterKeys.DISTRICT, (key) => key);

  const languageFilter = createFilterList(filter[FilterKeys.LANGUAGE], setFilter, FilterKeys.LANGUAGE, (key) => key);

  const engagementFilter = createFilterList(filter[FilterKeys.ENGAGEMENT], setFilter, FilterKeys.ENGAGEMENT, (key) =>
    t(`dashboard.volunteers.filters.engagement.${key}`),
  );

  const availabilityFilter = createAvailabilityFilterItems(filter[FilterKeys.AVAILABILITY], setFilter, t);

  return { districtFilter, languageFilter, engagementFilter, availabilityFilter };
};

/**
 * Builds availability-based filter sections (days, times, occasional).
 */
export const createAvailabilityFilterItems = (availability: Availability, setFilter: SetFilter, t: TFunction) => {
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
          [FilterKeys.AVAILABILITY]: { ...availability, [labelKey]: updated },
        }));
      },
    })),
  });

  return [
    createAvailabilityGroup("days", days),
    createAvailabilityGroup("times", times),
    createAvailabilityGroup("occasional", occasional),
  ];
};
