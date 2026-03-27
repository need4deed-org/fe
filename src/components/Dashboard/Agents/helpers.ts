import {
  AgentEngagementStatusType,
  AgentServiceType,
  AgentTrustType,
  AgentVolunteerSearchType,
  ApiAgentGet,
  OptionById,
} from "need4deed-sdk";

export function getNormalizedAgent(agent: ApiAgentGet): Omit<
  ApiAgentGet,
  "district" | "statusEngagement" | "volunteerSearch" | "serviceType" | "trustLevel"
> & {
  district: OptionById | undefined;
  statusEngagement: AgentEngagementStatusType;
  volunteerSearch: AgentVolunteerSearchType;
  trustLevel: AgentTrustType;
  serviceType: AgentServiceType[] | undefined;
} {
  return {
    ...agent,
    district: agent.district,
    statusEngagement: agent.statusEngagement,
    volunteerSearch: agent.volunteerSearch,
    trustLevel: agent.trustLevel,
    serviceType: agent.serviceType,
  };
}
