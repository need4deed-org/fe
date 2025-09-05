import { ApiVolunteerGetList, ByDay, Hour } from "need4deed-sdk";

export const mockVolunteer: ApiVolunteerGetList = {
  name: "Jack Sparrow",
  nativeLanguages: ["German", "Arabic", "Turkish"],
  fluentLanguages: ["English", "Spanish"],
  intermediateLanguages: ["French"],

  availability: [
    {
      day: ByDay.MO,
      daytime: [Hour.H08, Hour.H12],
    },
    {
      day: ByDay.WE,
      daytime: [Hour.H13, Hour.H17],
    },
    {
      day: "occasionally",
      daytime: "weekdays",
    },
  ],
  activities: ["TUTORING", "UNIQUE SKILLS", "ARTS & CRAFTS", "DAYCARE", "WOMEN'S ACTIVITIES"],
  skills: ["Fitness", "Cooking", "Gardening", "Teaching"],
  locations: ["Treptow", "Kreuzberg", "Neukölln", "Friedrichshain"],
};
