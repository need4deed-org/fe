import { OpportunityVolunteerStatusType } from "need4deed-sdk";

export type VolunteerLinkedOpportunity = {
  id: number;
  m2mId: number;
  opportunityId: number;
  title: string;
  appliedAt: string;
  tabStatus: OpportunityVolunteerStatusType;
};
