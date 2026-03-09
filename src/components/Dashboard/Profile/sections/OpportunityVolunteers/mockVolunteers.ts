import { OpportunityVolunteerStatusType, VolunteerStateEngagementType, VolunteerStateTypeType } from "need4deed-sdk";

export type MockVolunteerLanguage = {
  title: string;
  proficiency: string;
};

export type MockOpportunityVolunteer = {
  id: number;
  name: string;
  avatarUrl?: string;
  engagementStatus: VolunteerStateEngagementType;
  volunteerType: VolunteerStateTypeType;
  appliedAt: string;
  tabStatus: OpportunityVolunteerStatusType;
  languages: MockVolunteerLanguage[];
  activities: string[];
  skills: string[];
  availability: string;
  locations: string[];
};

export const mockVolunteers: MockOpportunityVolunteer[] = [
  {
    id: 1,
    name: "Anna Müller",
    engagementStatus: VolunteerStateEngagementType.AVAILABLE,
    volunteerType: VolunteerStateTypeType.REGULAR,
    appliedAt: "12.02.2025",
    tabStatus: OpportunityVolunteerStatusType.SUGGESTED,
    languages: [
      { title: "German", proficiency: "Native" },
      { title: "French", proficiency: "Fluent" },
      { title: "Flemish", proficiency: "Fluent" },
      { title: "Dutch", proficiency: "Fluent" },
    ],
    activities: [
      "Tutoring",
      "Sports",
      "Gardening",
      "Cooking",
      "Music",
      "Arts & Crafts",
      "Language Exchange",
      "Childcare",
      "IT Support",
      "Mentoring",
      "Bike Repair",
      "Sewing",
      "Photography",
    ],
    skills: [
      "Tutoring",
      "Daycare",
      "Teaching",
      "First Aid",
      "Project Management",
      "Translation",
      "Counseling",
      "Event Planning",
      "Cooking",
      "Gardening",
      "IT Support",
    ],
    availability: "Flexible, 16-20:00",
    locations: ["Tempelhof-Schöneberg"],
  },
  {
    id: 2,
    name: "Max Schmidt",
    engagementStatus: VolunteerStateEngagementType.ACTIVE,
    volunteerType: VolunteerStateTypeType.ACCOMPANYING,
    appliedAt: "15.02.2025",
    tabStatus: OpportunityVolunteerStatusType.MATCHED,
    languages: [
      { title: "German", proficiency: "Native" },
      { title: "English", proficiency: "Fluent" },
      { title: "Arabic", proficiency: "Beginner" },
    ],
    activities: ["Accompanying", "Translation", "Sports"],
    skills: ["Translation", "Driving", "First Aid"],
    availability: "Weekdays, 09-14:00",
    locations: ["Neukölln", "Kreuzberg"],
  },
  {
    id: 3,
    name: "Sophie Wagner",
    engagementStatus: VolunteerStateEngagementType.ACTIVE,
    volunteerType: VolunteerStateTypeType.REGULAR,
    appliedAt: "18.02.2025",
    tabStatus: OpportunityVolunteerStatusType.MATCHED,
    languages: [
      { title: "German", proficiency: "Native" },
      { title: "Spanish", proficiency: "Advanced" },
    ],
    activities: ["Tutoring", "Childcare", "Arts & Crafts", "Music"],
    skills: ["Teaching", "Childcare", "Painting"],
    availability: "Weekends, 10-16:00",
    locations: ["Charlottenburg-Wilmersdorf"],
  },
  {
    id: 4,
    name: "Jonas Becker",
    engagementStatus: VolunteerStateEngagementType.ACTIVE,
    volunteerType: VolunteerStateTypeType.EVENTS,
    appliedAt: "20.02.2025",
    tabStatus: OpportunityVolunteerStatusType.ACTIVE,
    languages: [
      { title: "German", proficiency: "Native" },
      { title: "English", proficiency: "Advanced" },
      { title: "Turkish", proficiency: "Intermediate" },
    ],
    activities: ["Event Planning", "Sports", "Cooking", "Photography"],
    skills: ["Event Planning", "Photography", "Social Media"],
    availability: "Flexible",
    locations: ["Mitte", "Friedrichshain-Kreuzberg"],
  },
];
