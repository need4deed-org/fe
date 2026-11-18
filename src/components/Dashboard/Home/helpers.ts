import { routes } from "@/constants/routes";
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
  { linkUrl: (lang: string, id: string | number) => string; path: string }
> = {
  agent: {
    linkUrl: routes.organizationDetail,
    path: apiPathAgent,
  },
  opportunity: {
    linkUrl: routes.opportunityDetail,
    path: apiPathOpportunity,
  },
  volunteer: {
    linkUrl: routes.volunteerDetail,
    path: apiPathVolunteer,
  },
};
