import { OptionId } from "need4deed-sdk";

export interface Volunteer {
  originOpportunity: number | undefined;
  fullName: string;
  phone: string;
  email: string;
  postalCode: number;
  goodConductCertificate: "Yes" | "No";
  ifMeaslesVaccination: boolean;
  leadFrom: string;
  schedule: [number, OptionId][];
  preferredBerlinLocations: OptionId[];
  activities: string[];
  skills: string[];
  nativeLanguages: OptionId[];
  fluentLanguages: OptionId[];
  intermediateLanguages: OptionId[];
  comments: string;
}
