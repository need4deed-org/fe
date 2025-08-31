import { Selected } from "./formTypes";

export enum TimeSlot {
  MORNING = "08-11",
  NOON = "11-14",
  AFTERNOON = "14-17",
  EVENING = "17-20",
  WEEKDAYS = "weekdays",
  WEEKENDS = "weekends",
}

export type Availability = Array<{
  weekday: number;
  timeSlots: Selected[];
}>;
