import { OptionId, OptionTitle } from "need4deed-sdk";

export enum FormType {
  VOLUNTEER = "volunteer",
  OPPORTUNITY = "opportunity",
}

export interface Selected {
  id: OptionId;
  title: OptionTitle;
  selected: boolean;
}

export enum Weekday {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
  OCCASIONAL = "onetime",
}

export interface OpportunityInfo {
  id: string;
  title: string;
}
