import { LanguageObject } from "@/types";
import { VolunteerFormData } from "need4deed-sdk";
import { Availability } from "@/components/forms/types/availabilityTypes";
import { getScheduleState } from "../forms/utils";

export type ApiVolunteerRegister = { volunteer: VolunteerFormData };

export interface ProfileCompletionData {
  addressPostcode: string;
  locations: number[];
  languages: LanguageObject[];
  availability: Availability;
  activities: number[];
  skills: number[];
  leadFrom: number[];
  certOfGoodConduct: boolean | undefined;
  certMeaslesVaccination: boolean | undefined;
  comments: string;
}

export const defaultVolunteerRegistrationData: ProfileCompletionData = {
  addressPostcode: "",
  locations: [],
  languages: [{ id: 1, language: "", level: "" }],
  availability: getScheduleState(),
  activities: [],
  skills: [],
  leadFrom: [],
  certOfGoodConduct: undefined,
  certMeaslesVaccination: undefined,
  comments: "",
};

export const TOTAL_STEPS = 1;
export const TOTAL_COMPLETION_STEPS = 3;
