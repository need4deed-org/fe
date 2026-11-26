import { Dispatch, SetStateAction } from "react";
import { ApiOptionLists, ByDay, OccasionalType, TimeSlot } from "need4deed-sdk";
import { OpportunityCardsFilter } from "../../Opportunities/Filters/types";
import { VolunteerCardsFilter } from "../../Volunteers/Filters/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { SelectionFilterConfigs } from "./selectionFilters";

export type SetFilter<TFilter> = Dispatch<SetStateAction<TFilter>>;

export type SelectionMap = Record<string, boolean>;

export interface ScheduleFilter {
  times: Record<TimeSlot, boolean>;
  days: Record<ByDay, boolean>;
  occasional: Record<OccasionalType, boolean>;
}

export type FilterItem = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  keyValue: string;
  parentKey?: string;
};

export type SupportedCardsFilter = OpportunityCardsFilter | VolunteerCardsFilter;

export interface UsePrefillFiltersParams<TFilter extends SupportedCardsFilter, TItem extends string> {
  searchParams: ReadonlyURLSearchParams;
  apiFilterOptions?: ApiOptionLists;
  defaultCardsFilter: TFilter;
  filterConfigs: SelectionFilterConfigs<TFilter>;
  deserializeFilters: (baseFilters: TFilter, searchParams: ReadonlyURLSearchParams) => TFilter;
  serializeFilters: (filter: TFilter, searchParams: ReadonlyURLSearchParams) => URLSearchParams | string;
  defaultStatuses?: TItem[];
  defaultEngagements?: TItem[];
  roleDefaultStatuses?: TItem[];
  roleDefaultEngagements?: TItem[];
  skipDefaults?: boolean;
  isReady?: boolean;
}
