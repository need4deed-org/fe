import { ROUTES } from "@/constants/routes";
import { apiPathAgent, apiPathOpportunity, apiPathVolunteer } from "@/config/constants";
import { DashboardEntityType } from "@/hooks/useGetEntityTitle";
import { ApiAgentGet, ApiOpportunityGet, ApiVolunteerGet } from "need4deed-sdk";

export type ApiEntityGet = {
  agent: ApiAgentGet;
  opportunity: ApiOpportunityGet;
  volunteer: ApiVolunteerGet;
};

export const processEntity: Record<
  DashboardEntityType,
  { linkUrl: (lang: string, id: number) => string; path: string }
> = {
  agent: {
    linkUrl: ROUTES.organizationDetail,
    path: apiPathAgent,
  },
  opportunity: {
    linkUrl: ROUTES.opportunityDetail,
    path: apiPathOpportunity,
  },
  volunteer: {
    linkUrl: ROUTES.volunteerDetail,
    path: apiPathVolunteer,
  },
};
