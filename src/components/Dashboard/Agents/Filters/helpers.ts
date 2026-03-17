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

  const typeFilters = generateNestedFilterControlItems(filter.type, setFilter, "type", (key) =>
    t(`dashboard.agents.filters.type.${key.toLocaleLowerCase()}`),
  );

  const volunteerSearchFilters = generateNestedFilterControlItems(
    filter.volunteerSearch,
    setFilter,
    "volunteerSearch",
    (key) => t(`dashboard.agents.filters.volunteerSearch.${key}`),
  );

  return {
    districtFilters,
    volunteerSearchFilters,
    typeFilters,
  };
};

export const createSelectedAgentFiltersAsFlatArray = (
  filter: AgentCardsFilter,
  setFilter: SetFilter<AgentCardsFilter>,
  t: TFunction,
) => {
  const { districtFilters, volunteerSearchFilters, typeFilters } = createAgentFilterItems(filter, setFilter, t);
  return [...districtFilters, ...volunteerSearchFilters, ...typeFilters].filter((f) => f.checked);
};
