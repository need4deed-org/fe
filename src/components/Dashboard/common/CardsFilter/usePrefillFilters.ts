import { SelectionFilterConfigs, withOptionFilters } from "@/components/Dashboard/common/CardsFilter/selectionFilters";
import { ApiOptionLists, QueryParamsKeys } from "need4deed-sdk";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { OpportunityCardsFilter } from "../../Opportunities/Filters/types";
import { VolunteerCardsFilter } from "../../Volunteers/Filters/types";

const EMPTY_LIST: string[] = [];

export const STATUS_PARAM = "status";

type SupportedCardsFilter = OpportunityCardsFilter | VolunteerCardsFilter;

function getStatusOrEngagementMap(filter: SupportedCardsFilter): Record<string, boolean> {
  return QueryParamsKeys.ENGAGEMENT in filter ? filter[QueryParamsKeys.ENGAGEMENT] : filter.status;
}

export interface UsePrefillFiltersParams<TFilter extends SupportedCardsFilter, TItem extends string> {
  searchParams: ReadonlyURLSearchParams;
  apiFilterOptions?: ApiOptionLists;
  defaultCardsFilter: TFilter;
  filterConfigs: SelectionFilterConfigs<TFilter>;
  deserializeFilters: (baseFilters: TFilter, searchParams: ReadonlyURLSearchParams) => TFilter;
  defaultStatuses?: TItem[];
  defaultEngagements?: TItem[];
  roleDefaultStatuses?: TItem[];
  roleDefaultEngagements?: TItem[];
  skipDefaults?: boolean;
}

export const usePrefillFilters = <TFilter extends SupportedCardsFilter, TItem extends string>({
  searchParams,
  apiFilterOptions,
  defaultCardsFilter,
  filterConfigs,
  deserializeFilters,
  defaultStatuses = EMPTY_LIST as TItem[],
  defaultEngagements = EMPTY_LIST as TItem[],
  roleDefaultStatuses,
  roleDefaultEngagements,
  skipDefaults = false,
}: UsePrefillFiltersParams<TFilter, TItem>) => {
  const defaultAppliedRef = useRef(false);

  const isEngagementFilter = QueryParamsKeys.ENGAGEMENT in defaultCardsFilter;
  const paramName = isEngagementFilter ? QueryParamsKeys.ENGAGEMENT : STATUS_PARAM;

  const activeRoleDefaults = (roleDefaultEngagements ?? roleDefaultStatuses ?? EMPTY_LIST) as TItem[];
  const activeBaseDefaults = isEngagementFilter ? defaultEngagements : defaultStatuses;

  const statusOrEngagementMap = getStatusOrEngagementMap(defaultCardsFilter);

  const hasValidFilterParam = Object.keys(statusOrEngagementMap).some((key) =>
    searchParams.getAll(paramName).includes(key),
  );

  const shouldApplyDefaults =
    !defaultAppliedRef.current && !skipDefaults && !hasValidFilterParam && activeRoleDefaults.length > 0;

  const resolvedDefaults = shouldApplyDefaults ? activeRoleDefaults : activeBaseDefaults;

  const cardsFilter = useMemo(() => {
    const baseFilters = apiFilterOptions
      ? withOptionFilters(filterConfigs, defaultCardsFilter, apiFilterOptions)
      : structuredClone(defaultCardsFilter);

    const filter = deserializeFilters(baseFilters, searchParams);

    if (shouldApplyDefaults) {
      const targetMap = getStatusOrEngagementMap(filter);
      activeRoleDefaults.forEach((item) => {
        targetMap[item] = true;
      });
    }

    return filter;
  }, [
    activeRoleDefaults,
    apiFilterOptions,
    defaultCardsFilter,
    deserializeFilters,
    filterConfigs,
    searchParams,
    shouldApplyDefaults,
  ]);

  return {
    cardsFilter,
    defaultStatuses: resolvedDefaults,
    defaultEngagements: resolvedDefaults,
    hasInitialFilterParams: hasValidFilterParam,
    defaultAppliedRef,
  };
};
