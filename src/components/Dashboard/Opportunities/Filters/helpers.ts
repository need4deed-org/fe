import { TFunction } from "i18next";
import { generateNestedFilterControlItems } from "../../common/CardsFilter/helpers";
import { SetFilter } from "../../common/CardsFilter/types";
import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";
import { OpportunityCardsFilter } from "./types";

export const createOpportunityFilterItems = (
  filter: OpportunityCardsFilter,
  setFilter: SetFilter<OpportunityCardsFilter>,
  t: TFunction,
) => {
  const districtFilters = generateNestedFilterControlItems(
    filter[QueryParamsKeys.DISTRICT],
    setFilter,
    QueryParamsKeys.DISTRICT,
    (key) => key,
  );

  const languageFilters = generateNestedFilterControlItems(
    filter[QueryParamsKeys.LANGUAGE],
    setFilter,
    QueryParamsKeys.LANGUAGE,
    (key) => key,
  );

  const statusFilters = generateNestedFilterControlItems(filter.status, setFilter, "status", (key) =>
    t(`dashboard.opportunities.filters.status.${key}`),
  );

  const typeFilters = generateNestedFilterControlItems(filter.type, setFilter, "type", (key) =>
    t(`dashboard.opportunities.filters.type.${key}`),
  );

  const activityFilters = generateNestedFilterControlItems(
    filter[EntityTableName.ACTIVITY],
    setFilter,
    EntityTableName.ACTIVITY,
    (key) => key,
  );

  return { districtFilters, languageFilters, statusFilters, typeFilters, activityFilters };
};

export const createSelectedOpportunityFiltersAsFlatArray = (
  filter: OpportunityCardsFilter,
  setFilter: SetFilter<OpportunityCardsFilter>,
  t: TFunction,
) => {
  const { districtFilters, languageFilters, statusFilters, typeFilters, activityFilters } =
    createOpportunityFilterItems(filter, setFilter, t);
  return [...districtFilters, ...languageFilters, ...statusFilters, ...typeFilters, ...activityFilters].filter(
    (f) => f.checked,
  );
};
