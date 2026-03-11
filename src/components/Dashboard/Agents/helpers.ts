import {
  AgentEngagementStatusType,
  AgentServiceType,
  AgentVolunteerSearchType,
  ApiAgentGet,
  OptionById,
} from "need4deed-sdk";

export function getNormalizedAgent(agent: ApiAgentGet): Omit<
  ApiAgentGet,
  "district" | "statusEngagement" | "volunteerSearch" | "serviceType"
> & {
  district: OptionById | undefined;
  statusEngagement: AgentEngagementStatusType;
  volunteerSearch: AgentVolunteerSearchType;
  serviceType: AgentServiceType[] | undefined;
} {
  return {
    ...agent,
    district: agent.district,
    statusEngagement: agent.statusEngagement,
    volunteerSearch: agent.volunteerSearch,
    serviceType: agent.serviceType,
  };
}
