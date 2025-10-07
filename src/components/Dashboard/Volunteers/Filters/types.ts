import { ByDay, OccasionalType } from "need4deed-sdk";
import { FilterKeys, TimeSlot } from "./constants";
import { Dispatch, SetStateAction } from "react";

export type SelectionMap = Record<string, boolean>;
export interface CardsFilter {
  [FilterKeys.SEARCH]: string;
  [FilterKeys.ACCOMPANYING]: boolean;
  [FilterKeys.ENGAGEMENT]: SelectionMap;
  [FilterKeys.AVAILABILITY]: Availability;
  [FilterKeys.DISTRICT]: SelectionMap;
  [FilterKeys.LANGUAGE]: SelectionMap;
}

export interface Availability {
  times: Record<TimeSlot, boolean>;
  days: Record<ByDay, boolean>;
  occasional: Record<OccasionalType, boolean>;
}

export type CardFilterKeys = keyof CardsFilter;

export type SetFilter = Dispatch<SetStateAction<CardsFilter>>;
