import { Option } from "need4deed-sdk";

export enum ListsOfOptions {
  LOCATIONS = "locations",
  LANGUAGES = "languages",
  ACTIVITIES = "activities",
  ACTIVITIES_ACCOMPANYING = "activitiesAccompanying",
  SKILLS = "skills",
  LEADS = "leads",
}

export type ListsOfOptionsType = Record<ListsOfOptions, Option[]>;
