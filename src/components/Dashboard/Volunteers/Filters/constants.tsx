import { ByDay, OccasionalType } from "need4deed-sdk";
import { CardsFilter } from "./types";

export enum TimeSlot {
  morning = "08-11",
  noon = "11-14",
  afternoon = "14-17",
  evening = "17-20",
}

export enum FilterKeys {
  SEARCH = "search",
  ACCOMPANYING = "accompanying",
  DISTRICT = "district",
  ENGAGEMENT = "engagement",
  AVAILABILITY = "availability",
  LANGUAGE = "languages",
}

export const defaultVolunteerCardsFilter: CardsFilter = {
  [FilterKeys.SEARCH]: "",
  [FilterKeys.ACCOMPANYING]: false,
  [FilterKeys.DISTRICT]: {},
  [FilterKeys.LANGUAGE]: {},
  [FilterKeys.ENGAGEMENT]: {
    new: false,
    active: false,
    available: false,
    temporarilyUnavailable: false,
    inactive: false,
    unresponsive: false,
  },
  [FilterKeys.AVAILABILITY]: {
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

export const SEPERATOR = "~";
export type AvailabilityKeys = keyof CardsFilter["availability"];
export type AvailabilitySubKeys = TimeSlot | ByDay | OccasionalType;
