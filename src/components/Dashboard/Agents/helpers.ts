import {
  AgentEngagementStatusType,
  ApiAgentGetList,
  AgentServiceType,
  ApiOptionLists,
  AgentTrustType,
  AgentVolunteerSearchType,
  ApiAgentGet,
  OptionById,
  QueryParamsKeys,
} from "need4deed-sdk";

import { ReadonlyURLSearchParams } from "next/navigation";
import { AgentCardsFilter } from "./Filters/types";

type AgentListItem = ApiAgentGetList & ApiAgentGet;

export function getNormalizedAgent(agent: AgentListItem): Omit<
  AgentListItem,
  "district" | "statusEngagement" | "volunteerSearch" | "serviceType"
> & {
  district: OptionById | undefined;
  statusEngagement: AgentEngagementStatusType;
  volunteerSearch: AgentVolunteerSearchType;
  trustLevel: AgentTrustType;
  serviceType: AgentServiceType[] | undefined;
} {
  return {
    ...agent,
    district: agent.district,
    statusEngagement: agent.statusEngagement,
    volunteerSearch: agent.volunteerSearch,
    trustLevel: agent.trustLevel,
    serviceType: agent.serviceType,
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

  params.delete("status");
  Object.entries(filter.status).forEach(([key, value]) => {
    if (value === true) {
      params.append("status", key);
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

  const queryStatus = searchParams.getAll("status");
  queryStatus.forEach((s) => {
    if (newFilter.status[s] !== undefined) newFilter.status[s] = true;
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
