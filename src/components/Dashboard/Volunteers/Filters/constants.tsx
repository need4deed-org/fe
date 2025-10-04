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
}

export const defaultVolunteerCardsFilter: CardsFilter = {
  [FilterKeys.SEARCH]: "",
  [FilterKeys.ACCOMPANYING]: false,
  [FilterKeys.DISTRICT]: {},
  [FilterKeys.ENGAGEMENT]: {
    active: false,
    inactive: false,
    new: false,
    temporarilyInactive: false,
  },
  [FilterKeys.AVAILABILITY]: {
    times: {
      [TimeSlot.morning]: false,
      [TimeSlot.noon]: false,
      [TimeSlot.afternoon]: false,
      [TimeSlot.evening]: false,
    },
    days: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    },
    occasional: {
      weekdays: false,
      weekends: false,
    },
  },
};

// export const FILTER_KEY_LIST = Object.values(FILTER_KEY);

// export type FilterKey = (typeof FILTER_KEY)[keyof typeof FILTER_KEY];

// export const DASH = "-";
