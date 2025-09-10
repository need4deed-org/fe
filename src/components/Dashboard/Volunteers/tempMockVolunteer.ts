import { ApiVolunteerGetList, ByDay, Hour, LangProficiency } from "need4deed-sdk";

export const mockVolunteer: ApiVolunteerGetList = {
  name: "Jack Sparrow",
  languages: [
    { title: "English", proficiency: LangProficiency.FLUENT },
    { title: "Spanish", proficiency: LangProficiency.FLUENT },

    { title: "German", proficiency: LangProficiency.NATIVE },
    { title: "Arabic", proficiency: LangProficiency.NATIVE },
    { title: "Turkish", proficiency: LangProficiency.NATIVE },

    { title: "French", proficiency: LangProficiency.INTERMEDIATE },
  ],
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
