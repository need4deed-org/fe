import { ApiLanguage, ApiOptionLists, LangProficiency } from "need4deed-sdk";
import { ReadonlyURLSearchParams } from "next/navigation";
import { CardsFilter, Engagement } from "./Filters/types";
import { FilterKeys } from "./Filters/constants";

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

  languages.forEach((lang) => {
    const { proficiency, title } = lang;

    if (!groupedLanguagesMap.has(proficiency)) {
      groupedLanguagesMap.set(proficiency, []);
    }
    groupedLanguagesMap.get(proficiency)!.push(title);
  });

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

export function serializeFilters(filter: CardsFilter, searchParams: ReadonlyURLSearchParams) {
  const params = new URLSearchParams(searchParams);

  if (filter.search) params.set(FilterKeys.SEARCH, filter.search);
  else params.delete(FilterKeys.SEARCH);

  if (filter.accompanying) params.set(FilterKeys.ACCOMPANYING, "true");
  else params.delete(FilterKeys.ACCOMPANYING);

  // 2. Clear all existing 'district' params
  params.delete(FilterKeys.DISTRICT);
  if (filter.district) {
    Object.entries(filter.district).forEach(([key, value]) => {
      if (value === true) {
        params.append(FilterKeys.DISTRICT, key);
      }
    });
  }

  // 2. Clear all existing 'district' params
  params.delete(FilterKeys.LANGUAGE);
  if (filter.languages) {
    Object.entries(filter.languages).forEach(([key, value]) => {
      if (value === true) {
        params.append(FilterKeys.LANGUAGE, key);
      }
    });
  }

  // 2. Clear all existing 'engagement' params
  params.delete(FilterKeys.ENGAGEMENT);
  if (filter.engagement) {
    Object.entries(filter.engagement).forEach(([key, value]) => {
      if (value === true) {
        params.append(FilterKeys.ENGAGEMENT, key);
      }
    });
  }

  // if (filters.days) {
  //   Object.entries(filters.days).forEach(([day, timeSlots]) => {
  //     const dayKey = day as Weekday;

  //     Object.entries(timeSlots as TimeSlot).forEach(([slot, value]) => {
  //       if (value) {
  //         params.append(FilterKeys.DAYS, `${dayKey}${DASH}${slot}`);
  //       }
  //     });
  //   });
  // }

  return params.toString();
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
    // Check if the query param value is exist in the filters. if not, ignore that query param !!!
    if (newFilter.languages[l] !== undefined) {
      newFilter.languages[l] = true;
    }
  });

  const queryEngagement = searchParams.getAll(FilterKeys.ENGAGEMENT);
  queryEngagement.forEach((eng) => {
    // Check if the query param value is exist in the filters. if not, ignore that query param !!!
    const e = eng as keyof Engagement;
    if (newFilter.engagement[e] !== undefined) {
      newFilter.engagement[e] = true;
    }
  });

  // const daySlots = queryParams.getAll(FilterKeys.DAYS);
  // daySlots.forEach((slot) => {
  //   const [day, time] = slot.split(DASH);
  //   const dayKey = day as DaysKeys;
  //   const timeKey = time as DayKeys;

  //   if (filters.days[dayKey] && filters.days[dayKey][timeKey] !== undefined) {
  //     filters.days[dayKey][timeKey] = true;
  //   }
  // });

  return newFilter;
}

export const createFilterFromOption = (option: ApiOptionLists, field: keyof ApiOptionLists) =>
  option[field] ? option[field].reduce((acc, curr) => ({ ...acc, [curr.title]: false }), {}) : {};
