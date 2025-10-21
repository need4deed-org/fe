import { ApiLanguage, ApiOptionLists, LangProficiency } from "need4deed-sdk";
import { ReadonlyURLSearchParams } from "next/navigation";
import { AvailabilityKeys, AvailabilitySubKeys, FilterKeys, SEPARATOR } from "./Filters/constants";
import { CardsFilter } from "./Filters/types";

const proficiencyOrder = [
  LangProficiency.NATIVE,
  LangProficiency.FLUENT,
  LangProficiency.ADVANCED,
  LangProficiency.INTERMEDIATE,
  LangProficiency.BEGINNER,
];

interface GroupedLanguage {
  proficiency: LangProficiency;
  list: string[];
}

/**
 * Groups a list of languages by their proficiency level.
 * @param languages The input array of ApiLanguage objects.
 * @returns An array of GroupedLanguage objects.
 */
export const groupLanguagesByProficiency = (languages: ApiLanguage[]): GroupedLanguage[] => {
  const groupedLanguagesMap = new Map<LangProficiency, string[]>();

  for (const { proficiency, title } of languages) {
    if (!proficiency) continue;

    if (!groupedLanguagesMap.has(proficiency || LangProficiency.BEGINNER)) {
      groupedLanguagesMap.set(proficiency || LangProficiency.BEGINNER, []);
    }

    groupedLanguagesMap.get(proficiency)!.push(title);
  }

  // Convert the Map to the desired array format
  const groupedLanguages: GroupedLanguage[] = [];
  groupedLanguagesMap.forEach((list, proficiency) => {
    groupedLanguages.push({ proficiency, list });
  });

  // 👇️ Sorting Languages
  groupedLanguages.sort((a, b) => {
    return proficiencyOrder.indexOf(a.proficiency) - proficiencyOrder.indexOf(b.proficiency);
  });

  return groupedLanguages;
};

export function serializeFilters(filter: CardsFilter, searchParams?: ReadonlyURLSearchParams, asString = true) {
  const params = new URLSearchParams(searchParams);

  if (filter.search) params.set(FilterKeys.SEARCH, filter.search);
  else params.delete(FilterKeys.SEARCH);

  if (filter.accompanying) params.set(FilterKeys.ACCOMPANYING, "true");
  else params.delete(FilterKeys.ACCOMPANYING);

  // 2. Clear all existing 'district' params
  params.delete(FilterKeys.DISTRICT);
  Object.entries(filter.district).forEach(([key, value]) => {
    if (value === true) {
      params.append(FilterKeys.DISTRICT, key);
    }
  });

  // 2. Clear all existing 'district' params
  params.delete(FilterKeys.LANGUAGE);
  Object.entries(filter.languages).forEach(([key, value]) => {
    if (value === true) {
      params.append(FilterKeys.LANGUAGE, key);
    }
  });

  // 2. Clear all existing 'engagement' params
  params.delete(FilterKeys.ENGAGEMENT);
  Object.entries(filter.engagement).forEach(([key, value]) => {
    if (value === true) {
      params.append(FilterKeys.ENGAGEMENT, key);
    }
  });

  // 2. Clear all existing 'availability' params
  params.delete(FilterKeys.AVAILABILITY);
  Object.entries(filter.availability).forEach(([key, subSlot]) => {
    const availabilityKey = key as AvailabilityKeys;

    Object.entries(subSlot).forEach(([slot, value]) => {
      if (value) {
        params.append(FilterKeys.AVAILABILITY, `${availabilityKey}${SEPARATOR}${slot}`);
      }
    });
  });

  return asString ? params.toString() : params;
}

export function deserializeFilters(filter: CardsFilter, searchParams: ReadonlyURLSearchParams) {
  const newFilter: CardsFilter = structuredClone(filter);

  const search = searchParams.get(FilterKeys.SEARCH);
  if (search !== null) {
    newFilter.search = search;
  }

  const queryAccompanying = searchParams.get(FilterKeys.ACCOMPANYING);
  if (queryAccompanying === "true") {
    newFilter.accompanying = true;
  }

  const queryDistricts = searchParams.getAll(FilterKeys.DISTRICT);
  queryDistricts.forEach((d) => {
    // Check if the query param value is exist in the filters. if not, ignore that query param !!!
    if (newFilter.district[d] !== undefined) {
      newFilter.district[d] = true;
    }
  });

  const queryLanguages = searchParams.getAll(FilterKeys.LANGUAGE);
  queryLanguages.forEach((l) => {
    if (newFilter.languages[l] !== undefined) {
      newFilter.languages[l] = true;
    }
  });

  const queryEngagement = searchParams.getAll(FilterKeys.ENGAGEMENT);
  queryEngagement.forEach((e) => {
    if (newFilter.engagement[e] !== undefined) {
      newFilter.engagement[e] = true;
    }
  });

  const queryAvailability = searchParams.getAll(FilterKeys.AVAILABILITY);
  queryAvailability.forEach((item) => {
    const [firstKey, secondKey] = item.split(SEPARATOR);

    const avKey = firstKey as AvailabilityKeys;
    const avSubKey = secondKey as AvailabilitySubKeys;

    const subFilter = newFilter.availability[avKey] as Record<AvailabilitySubKeys, boolean>;

    if (subFilter && subFilter[avSubKey] !== undefined) {
      subFilter[avSubKey] = true;
    }
  });

  return newFilter;
}

export const createFilterFromOption = (option: ApiOptionLists, field: keyof ApiOptionLists) =>
  option[field] ? option[field].reduce((acc, curr) => ({ ...acc, [curr.title]: false }), {}) : {};
