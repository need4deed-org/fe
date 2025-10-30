import { ByDay, OccasionalType, QueryParamsKeys, TimeSlot } from "need4deed-sdk";
import { CardsFilter } from "./types";

export const defaultVolunteerCardsFilter: CardsFilter = {
  [QueryParamsKeys.SEARCH]: "",
  [QueryParamsKeys.ACCOMPANYING]: false,
  [QueryParamsKeys.DISTRICT]: {},
  [QueryParamsKeys.LANGUAGE]: {},
  [QueryParamsKeys.ENGAGEMENT]: {
    new: false,
    active: false,
    available: false,
    temporarilyUnavailable: false,
    inactive: false,
    unresponsive: false,
  },
  [QueryParamsKeys.AVAILABILITY]: {
    times: {
      [TimeSlot.morning]: false,
      [TimeSlot.noon]: false,
      [TimeSlot.afternoon]: false,
      [TimeSlot.evening]: false,
    },
    days: {
      [ByDay.MO]: false,
      [ByDay.TU]: false,
      [ByDay.WE]: false,
      [ByDay.TH]: false,
      [ByDay.FR]: false,
      [ByDay.SA]: false,
      [ByDay.SU]: false,
    },
    occasional: {
      [OccasionalType.WEEKDAYS]: false,
      [OccasionalType.WEEKENDS]: false,
    },
  },
};

export const SEPARATOR = "~";
export type AvailabilityKeys = keyof CardsFilter["availability"];
export type AvailabilitySubKeys = TimeSlot | ByDay | OccasionalType;
