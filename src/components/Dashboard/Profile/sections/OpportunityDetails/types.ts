import { ApiOpportunityGet } from "need4deed-sdk";

export type OpportunityWithDetails = ApiOpportunityGet & {
  description?: string;
  numberOfVolunteers?: number;
};
