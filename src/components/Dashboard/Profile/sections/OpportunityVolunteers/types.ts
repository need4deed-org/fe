import { OpportunityVolunteerStatusType, VolunteerStateEngagementType, VolunteerStateTypeType } from "need4deed-sdk";

export type VolunteerLanguage = {
  title: string;
  proficiency?: string;
};

export type OpportunityLinkedVolunteer = {
  id: number;
  m2mId: number;
  name: string;
  avatarUrl: string;
  engagementStatus: VolunteerStateEngagementType;
  volunteerType: VolunteerStateTypeType;
  appliedAt: string;
  tabStatus: OpportunityVolunteerStatusType;
  languages: VolunteerLanguage[];
  activities: string[];
  skills: string[];
  availability: string;
  locations: string[];
};
