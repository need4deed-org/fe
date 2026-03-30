import { TFunction } from "i18next";
import { generateNestedFilterControlItems } from "../../common/CardsFilter/helpers";
import { SetFilter } from "../../common/CardsFilter/types";
import { QueryParamsKeys } from "need4deed-sdk";
import { AgentCardsFilter } from "./types";

export const createAgentFilterItems = (
  filter: AgentCardsFilter,
  setFilter: SetFilter<AgentCardsFilter>,
  t: TFunction,
) => {
  const districtFilters = generateNestedFilterControlItems(
    filter[QueryParamsKeys.DISTRICT],
    setFilter,
    QueryParamsKeys.DISTRICT,
    (key) => key,
  );

  const statusFilters = generateNestedFilterControlItems(filter.status, setFilter, "status", (key) =>
    t(`dashboard.agents.filters.status.${key}`),
  );

  const volunteerSearchFilters = generateNestedFilterControlItems(
    filter.volunteerSearch,
    setFilter,
    "volunteerSearch",
    (key) => t(`dashboard.agents.filters.volunteerSearch.${key}`),
  );

  return { districtFilters, statusFilters, volunteerSearchFilters };
};

export const createSelectedAgentFiltersAsFlatArray = (
  filter: AgentCardsFilter,
  setFilter: SetFilter<AgentCardsFilter>,
  t: TFunction,
) => {
  const { districtFilters, statusFilters, volunteerSearchFilters } = createAgentFilterItems(filter, setFilter, t);
  return [...districtFilters, ...statusFilters, ...volunteerSearchFilters].filter((f) => f.checked);
};
