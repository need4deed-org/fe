import { ByDay, OccasionalType } from "need4deed-sdk";
import { TimeSlot } from "./constants";
import { Dispatch, SetStateAction } from "react";

export interface CardsFilter {
  search: string;
  accompanying: boolean;
  engagement: Engagement;
  availability: Availability;
  district: Record<string, boolean>;
}

interface Engagement {
  new: boolean;
  active: boolean;
  temporarilyInactive: boolean;
  inactive: boolean;
}

interface Availability {
  times: Record<TimeSlot, boolean>;
  days: Record<ByDay, boolean>;
  occasional: Record<OccasionalType, boolean>;
}

export type CardFilterKeys = keyof CardsFilter;

export type SetFilter = Dispatch<SetStateAction<CardsFilter>>;
