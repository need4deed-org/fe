import { ApiVolunteerGetList } from "need4deed-sdk";

export const mockRawVolunteers = [
  {
    id: 455,
    name: "John Doe",
    avatarUrl: "",
    statusEngagement: "new",
    statusType: "accompanying",
    languages: [
      {
        id: 0,
        title: "English",
        proficiency: "beginner",
      },
    ],
    availability: [
      {
        id: 0,
        day: "Monday",
        daytime: "08-11",
      },
    ],
    activities: [{ title: "Language café", id: 1 }],
    skills: [{ title: "Teaching", id: 1 }],
    locations: ["Neukölln"],
  },
] as unknown as ApiVolunteerGetList[];
