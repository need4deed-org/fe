import { withOptionFilters } from "@/components/Dashboard/common/CardsFilter/selectionFilters";
import { questionMark } from "@/config/constants";
import { QueryParamsKeys } from "need4deed-sdk";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { SupportedCardsFilter, UsePrefillFiltersParams } from "./types";
import { EMPTY_LIST, getStatusOrEngagementMap, STATUS_PARAM } from "./helpers";

export const usePrefillFilters = <TFilter extends SupportedCardsFilter, TItem extends string>({
  searchParams,
  apiFilterOptions,
  defaultCardsFilter,
  filterConfigs,
  deserializeFilters,
  serializeFilters,
  defaultStatuses = EMPTY_LIST as TItem[],
  defaultEngagements = EMPTY_LIST as TItem[],
  roleDefaultStatuses,
  roleDefaultEngagements,
  skipDefaults = false,
  isReady = true,
}: UsePrefillFiltersParams<TFilter, TItem>) => {
  const defaultAppliedRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const isEngagementFilter = QueryParamsKeys.ENGAGEMENT in defaultCardsFilter;
  const paramName = isEngagementFilter ? QueryParamsKeys.ENGAGEMENT : STATUS_PARAM;

  const activeRoleDefaults: TItem[] = (roleDefaultEngagements ?? roleDefaultStatuses ?? EMPTY_LIST) as TItem[];
  const activeBaseDefaults: TItem[] = isEngagementFilter ? defaultEngagements : defaultStatuses;
  const hasRoleDefaults = activeRoleDefaults.length > 0;

  const statusOrEngagementMap = getStatusOrEngagementMap(defaultCardsFilter);

  const hasValidFilterParam = Object.keys(statusOrEngagementMap).some((key) =>
    searchParams.getAll(paramName).includes(key),
  );
  const hasExplicitEmptyParam = searchParams.getAll(paramName).includes("");

  const shouldApplyDefaults =
    !defaultAppliedRef.current && !skipDefaults && !hasExplicitEmptyParam && !hasValidFilterParam && hasRoleDefaults;

  const resolvedDefaults: TItem[] = shouldApplyDefaults ? activeRoleDefaults : activeBaseDefaults;

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

  useEffect(() => {
    if (!isReady || !shouldApplyDefaults) return;

    defaultAppliedRef.current = true;
    const nextFilter = deserializeFilters(structuredClone(defaultCardsFilter), searchParams);
    const targetMap = getStatusOrEngagementMap(nextFilter);
    activeRoleDefaults.forEach((item) => {
      targetMap[item] = true;
    });

    const query = serializeFilters(nextFilter, searchParams).toString();
    router.replace(query ? pathname + questionMark + query : pathname, { scroll: false });
  }, [
    activeRoleDefaults,
    defaultCardsFilter,
    deserializeFilters,
    isReady,
    pathname,
    router,
    searchParams,
    serializeFilters,
    shouldApplyDefaults,
  ]);

  const serializeWithDefaultMarker = useCallback(
    (filter: TFilter) => {
      const params = new URLSearchParams(serializeFilters(filter, searchParams).toString());
      const valuesMap = getStatusOrEngagementMap(filter);
      const hasAnySelected = Object.values(valuesMap).some(Boolean);

      if (hasRoleDefaults && !hasAnySelected) {
        params.set(paramName, "");
      } else if (params.get(paramName) === "") {
        params.delete(paramName);
      }

      return params;
    },
    [hasRoleDefaults, paramName, searchParams, serializeFilters],
  );

  return {
    cardsFilter,
    defaultStatuses: resolvedDefaults,
    defaultEngagements: resolvedDefaults,
    hasInitialFilterParams: hasValidFilterParam,
    defaultAppliedRef,
    serializeWithDefaultMarker,
  };
};
