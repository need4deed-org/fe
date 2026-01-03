import { Lang, VolunteerFormData } from "need4deed-sdk";

import { LanguageObject } from "@/types";
import { Availability, Selected } from "../types";

export interface VolunteerData {
  opportunityId: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  locations: Selected[];
  availability: Availability;
  languages: LanguageObject[];
  activities: Selected[];
  skills: Selected[];
  certOfGoodConduct: boolean | undefined;
  certMeaslesVaccination: boolean | undefined;
  leadFrom: Selected[];
  comments: string;
  consent: boolean | undefined;
  language: Lang;
}

export enum VolunteerArrayDataKeys {
  LOCATIONS = "locations",
  LANGUAGES = "languages",
  ACTIVITIES = "activities",
  SKILLS = "skills",
  LEADFROM = "leadFrom",
}
export type VolunteerDataLists = `${VolunteerArrayDataKeys}`;

export interface VolunteerParsedData extends VolunteerFormData {
  language: Lang;
}
