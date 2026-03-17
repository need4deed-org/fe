import {
  AgentVolunteerSearchType,
  OptionById,
  ApiOptionLists,
  QueryParamsKeys,
  AgentType,
  ApiAgentGetList,
} from "need4deed-sdk";

import { ReadonlyURLSearchParams } from "next/navigation";
import { AgentCardsFilter } from "./Filters/types";

export function getNormalizedAgent(agent: ApiAgentGetList): Omit<
  ApiAgentGetList,
  "district" | "volunteerSearch" | "type"
> & {
  district: OptionById | undefined;
  volunteerSearch: AgentVolunteerSearchType;
  type: AgentType;
} {
  return {
    ...agent,
    type: agent.type,
    district: agent.district,
    volunteerSearch: agent.volunteerSearch,
  };
}

interface SerializeFiltersOptions {
  serializeToIDs?: boolean;
  apiFilterOptions?: ApiOptionLists;
}

export function serializeAgentFilters(
  filter: AgentCardsFilter,
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

  params.delete("type");
  Object.entries(filter.type).forEach(([key, value]) => {
    if (value === true) {
      params.append("type", key);
    }
  });

  params.delete("volunteerSearch");
  Object.entries(filter.volunteerSearch).forEach(([key, value]) => {
    if (value === true) {
      params.append("volunteerSearch", key);
    }
  });

  return asString ? params.toString() : params;
}

export function deserializeAgentFilters(
  filter: AgentCardsFilter,
  searchParams: ReadonlyURLSearchParams,
): AgentCardsFilter {
  const newFilter: AgentCardsFilter = structuredClone(filter);

  const search = searchParams.get(QueryParamsKeys.SEARCH);
  if (search !== null) newFilter.search = search;

  const queryDistricts = searchParams.getAll(QueryParamsKeys.DISTRICT);
  queryDistricts.forEach((d) => {
    if (newFilter.district[d] !== undefined) newFilter.district[d] = true;
  });

  const queryType = searchParams.getAll("type");
  queryType.forEach((s) => {
    if (newFilter.type[s] !== undefined) newFilter.type[s] = true;
  });

  const queryVolunteerSearch = searchParams.getAll("volunteerSearch");
  queryVolunteerSearch.forEach((s) => {
    if (newFilter.volunteerSearch[s] !== undefined) newFilter.volunteerSearch[s] = true;
  });

  return newFilter;
}

export function getOptionTitles(items: OptionById[] | undefined): string[] {
  if (!items) return [];
  return items.map((item) => (typeof item.title === "string" ? item.title : "")).filter(Boolean);
}
