import { ApiLanguage, LangProficiency } from "need4deed-sdk";
import { ReadonlyURLSearchParams } from "next/navigation";
import { CardsFilter } from "./Filters/types";
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

export function deserializeMergeQueryFilters(queryParams: ReadonlyURLSearchParams, filter: CardsFilter) {
  const filters: CardsFilter = structuredClone(filter);

  const search = queryParams.get(FilterKeys.SEARCH);
  if (search !== null) {
    filters.search = search;
  }

  const queryAccompanying = queryParams.get(FilterKeys.ACCOMPANYING);
  if (queryAccompanying === "true") {
    filters.accompanying = true;
  }

  // const activityTypes = queryParams.getAll(FilterKeys.ACTIVITY_TYPE);
  // activityTypes.forEach((type) => {
  //   if (hasKey(filters.activityType, type)) {
  //     filters.activityType[type] = true;
  //   }
  // });

  const queryDistricts = queryParams.getAll(FilterKeys.DISTRICT);
  queryDistricts.forEach((d) => {
    // Check if the query param value is exist in the filters, if not ignore that query param
    if (filters[FilterKeys.DISTRICT][d] !== undefined) {
      filters.district[d] = true;
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

  return filters;
}

export function serializeFilters(filters: CardsFilter) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set(FilterKeys.SEARCH, filters.search);
  }

  if (filters.accompanying) {
    params.set(FilterKeys.ACCOMPANYING, "true");
  }

  // if (filters.activityType) {
  //   Object.entries(filters.activityType).forEach(([key, value]) => {
  //     if (value === true) {
  //       params.append(FilterKeys.ACTIVITY_TYPE, key);
  //     }
  //   });
  // }

  if (filters.district) {
    Object.entries(filters.district).forEach(([key, value]) => {
      if (value === true) {
        params.append(FilterKeys.DISTRICT, key);
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
