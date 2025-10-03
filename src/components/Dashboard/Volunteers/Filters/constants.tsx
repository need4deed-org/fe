// import { CardFilterKeys } from "../types";
import { CardsFilter } from "./types";

export const defaultVolunteerCardsFilter: CardsFilter = {
  search: "",
  accompanying: false,
  district: {
    Charlottenburg: false,
    Friedrichshain: false,
    Hellersdorf: false,
    Kreuzberg: false,
  },
  engagement: {
    active: false,
    inactive: false,
    new: false,
    temporarilyInactive: false,
  },
  availability: {
    times: {
      "08-11": false,
      "11-14": false,
      "14-17": false,
      "17-20": false,
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

// export const FILTER_KEY = {
//   SEARCH_INPUT: "searchInput",
//   ACTIVITY_TYPE: "activityType",
//   DISTRICT: "district",
//   DAYS: "days",
//   ACCOMPANYING: "accompanying",
// } as const satisfies Record<string, CardFilterKeys>;

// export const FILTER_KEY_LIST = Object.values(FILTER_KEY);

// export type FilterKey = (typeof FILTER_KEY)[keyof typeof FILTER_KEY];

// export const DASH = "-";

export enum TimeSlot {
  morning = "08-11",
  noon = "11-14",
  afternoon = "14-17",
  evening = "17-20",
}
