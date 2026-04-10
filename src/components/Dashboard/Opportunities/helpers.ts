import { ApiLanguage, ApiOptionLists, LangPurpose, OptionById, QueryParamsKeys } from "need4deed-sdk";
import { ReadonlyURLSearchParams } from "next/navigation";
import { OpportunityCardsFilter } from "./Filters/types";

interface SerializeFiltersOptions {
  serializeToIDs?: boolean;
  apiFilterOptions?: ApiOptionLists;
}

export function serializeOpportunityFilters(
  filter: OpportunityCardsFilter,
  searchParams?: ReadonlyURLSearchParams,
  asString = true,
  options?: SerializeFiltersOptions,
) {
  const params = new URLSearchParams(searchParams);

  if (filter.search) params.set(QueryParamsKeys.SEARCH, filter.search);
  else params.delete(QueryParamsKeys.SEARCH);

  params.delete(QueryParamsKeys.DISTRICT);
  Object.entries(filter.district).forEach(([key, value]) => {
    if (value === true) {
      const paramValue =
        (options?.serializeToIDs && options.apiFilterOptions?.district?.find((d) => d.title === key)?.id) || key;
      params.append(QueryParamsKeys.DISTRICT, String(paramValue));
    }
  });

  params.delete(QueryParamsKeys.LANGUAGE);
  Object.entries(filter.language).forEach(([key, value]) => {
    if (value === true) {
      const paramValue =
        (options?.serializeToIDs && options.apiFilterOptions?.language?.find((d) => d.title === key)?.id) || key;
      params.append(QueryParamsKeys.LANGUAGE, String(paramValue));
    }
  });

  params.delete("status");
  Object.entries(filter.status).forEach(([key, value]) => {
    if (value === true) {
      params.append("status", key);
    }
  });

  params.delete("type");
  Object.entries(filter.type).forEach(([key, value]) => {
    if (value === true) {
      params.append("type", key);
    }
  });

  return asString ? params.toString() : params;
}

export function deserializeOpportunityFilters(
  filter: OpportunityCardsFilter,
  searchParams: ReadonlyURLSearchParams,
): OpportunityCardsFilter {
  const newFilter: OpportunityCardsFilter = structuredClone(filter);

  const search = searchParams.get(QueryParamsKeys.SEARCH);
  if (search !== null) newFilter.search = search;

  const queryDistricts = searchParams.getAll(QueryParamsKeys.DISTRICT);
  queryDistricts.forEach((d) => {
    if (newFilter.district[d] !== undefined) newFilter.district[d] = true;
  });

  const queryLanguages = searchParams.getAll(QueryParamsKeys.LANGUAGE);
  queryLanguages.forEach((l) => {
    if (newFilter.language[l] !== undefined) newFilter.language[l] = true;
  });

  const queryStatus = searchParams.getAll("status");
  queryStatus.forEach((s) => {
    if (newFilter.status[s] !== undefined) newFilter.status[s] = true;
  });

  const queryType = searchParams.getAll("type");
  queryType.forEach((s) => {
    if (newFilter.type[s] !== undefined) newFilter.type[s] = true;
  });

  return newFilter;
}

export function getLanguagesByPurpose(languages: ApiLanguage[] | undefined, purpose: LangPurpose) {
  if (!languages) return "";
  return languages
    .filter((lang) => lang.purpose === purpose)
    .map((lang) => lang.title)
    .join(", ");
}

export function getOptionTitles(items: OptionById[] | undefined): string[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item) => (typeof item.title === "string" ? item.title : "")).filter(Boolean);
}
