import { OpportunityVolunteerStatusType, VolunteerStateEngagementType, VolunteerStateTypeType } from "need4deed-sdk";

export type MockOpportunityVolunteer = {
  id: number;
  name: string;
  avatarUrl?: string;
  engagementStatus: VolunteerStateEngagementType;
  volunteerType: VolunteerStateTypeType;
  appliedAt: string;
  tabStatus: OpportunityVolunteerStatusType;
};

export const mockVolunteers: MockOpportunityVolunteer[] = [
  {
    id: 1,
    name: "Anna Müller",
    engagementStatus: VolunteerStateEngagementType.AVAILABLE,
    volunteerType: VolunteerStateTypeType.REGULAR,
    appliedAt: "12.02.2025",
    tabStatus: OpportunityVolunteerStatusType.SUGGESTED,
  },
  {
    id: 2,
    name: "Max Schmidt",
    engagementStatus: VolunteerStateEngagementType.ACTIVE,
    volunteerType: VolunteerStateTypeType.ACCOMPANYING,
    appliedAt: "15.02.2025",
    tabStatus: OpportunityVolunteerStatusType.MATCHED,
  },
  {
    id: 3,
    name: "Sophie Wagner",
    engagementStatus: VolunteerStateEngagementType.ACTIVE,
    volunteerType: VolunteerStateTypeType.REGULAR,
    appliedAt: "18.02.2025",
    tabStatus: OpportunityVolunteerStatusType.MATCHED,
  },
  {
    id: 4,
    name: "Jonas Becker",
    engagementStatus: VolunteerStateEngagementType.ACTIVE,
    volunteerType: VolunteerStateTypeType.EVENTS,
    appliedAt: "20.02.2025",
    tabStatus: OpportunityVolunteerStatusType.ACTIVE,
  },
];
