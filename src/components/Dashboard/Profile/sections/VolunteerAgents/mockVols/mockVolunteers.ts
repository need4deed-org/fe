import { ApiVolunteerGetList, OpportunityVolunteerStatusType } from "need4deed-sdk";

type MockVolunteerAgent = ApiVolunteerGetList & { tabStatus: OpportunityVolunteerStatusType };

export const mockRawVolunteers: MockVolunteerAgent[] = [
  {
    id: 455,
    name: "John Doe",
    avatarUrl: "",
    statusEngagement: "new",
    statusType: "accompanying",
    tabStatus: OpportunityVolunteerStatusType.PENDING,
    languages: [{ id: 0, title: "English", proficiency: "beginner" }],
    availability: [{ id: 0, day: "Monday", daytime: "08-11" }],
    activities: [{ title: "Language café", id: 1 }],
    skills: [{ title: "Teaching", id: 1 }],
    locations: ["Neukölln"],
  },
  {
    id: 456,
    name: "Maria Gonzalez",
    avatarUrl: "",
    statusEngagement: "active",
    statusType: "regular",
    tabStatus: OpportunityVolunteerStatusType.MATCHED,
    languages: [{ id: 1, title: "Spanish", proficiency: "native" }],
    availability: [{ id: 0, day: "Wednesday", daytime: "10-13" }],
    activities: [{ title: "Tutoring", id: 2 }],
    skills: [{ title: "Mentoring", id: 2 }],
    locations: ["Mitte"],
  },
  {
    id: 457,
    name: "Ahmed Hassan",
    avatarUrl: "",
    statusEngagement: "active",
    statusType: "regular",
    tabStatus: OpportunityVolunteerStatusType.ACTIVE,
    languages: [{ id: 2, title: "Arabic", proficiency: "native" }],
    availability: [{ id: 0, day: "Friday", daytime: "14-17" }],
    activities: [{ title: "Accompanying", id: 3 }],
    skills: [{ title: "Translation", id: 3 }],
    locations: ["Kreuzberg"],
  },
] as unknown as MockVolunteerAgent[];
