import { ByDay, OccasionalType } from "need4deed-sdk";
import { FilterKeys, TimeSlot } from "./constants";
import { Dispatch, SetStateAction } from "react";

export interface CardsFilter {
  [FilterKeys.SEARCH]: string;
  [FilterKeys.ACCOMPANYING]: boolean;
  [FilterKeys.ENGAGEMENT]: Engagement;
  [FilterKeys.AVAILABILITY]: Availability;
  [FilterKeys.DISTRICT]: Record<string, boolean>;
  [FilterKeys.LANGUAGE]: Record<string, boolean>;
}

export interface Engagement {
  new: boolean;
  active: boolean;
  temporarilyInactive: boolean;
  inactive: boolean;
}

export interface Availability {
  times: Record<TimeSlot, boolean>;
  days: Record<ByDay, boolean>;
  occasional: Record<OccasionalType, boolean>;
}

export type CardFilterKeys = keyof CardsFilter;

export type SetFilter = Dispatch<SetStateAction<CardsFilter>>;
