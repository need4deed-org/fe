import { ByDay, OccasionalType, QueryParamsKeys, TimeSlot } from "need4deed-sdk";
import { SelectionMap } from "../../common/CardsFilter/types";

export interface CardsFilter {
  [QueryParamsKeys.SEARCH]: string;
  [QueryParamsKeys.ACCOMPANYING]: boolean;
  [QueryParamsKeys.ENGAGEMENT]: SelectionMap;
  [QueryParamsKeys.AVAILABILITY]: Availability;
  [QueryParamsKeys.DISTRICT]: SelectionMap;
  [QueryParamsKeys.LANGUAGE]: SelectionMap;
}

export interface Availability {
  times: Record<TimeSlot, boolean>;
  days: Record<ByDay, boolean>;
  occasional: Record<OccasionalType, boolean>;
}

export type CardFilterKeys = keyof CardsFilter;
