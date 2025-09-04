import { Volunteer } from "./types";

export const mockVolunteer: Volunteer = {
  originOpportunity: 1234,
  fullName: "Jack Sparrow",
  phone: "1234",
  email: "jack@gmail.com",
  postalCode: 12345,
  goodConductCertificate: "Yes",
  ifMeaslesVaccination: true,
  leadFrom: "Berlin",
  schedule: [[1, 5]],
  preferredBerlinLocations: ["Treptow", "Kreuzberg", "Neukölln", "Friedrichshain"],
  activities: ["TUTORING", "UNIQUE SKILLS", "ARTS & CRAFTS", "DAYCARE", "WOMEN'S ACTIVITIES"],
  skills: ["Fitness", "Cooking", "Gardening", "Teaching"],
  nativeLanguages: ["German", "Arabic", "Turkish"],
  fluentLanguages: ["English", "Spanish"],
  intermediateLanguages: ["French"],
  comments: "some random comment",
};
