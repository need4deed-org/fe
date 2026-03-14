import {
  AgentEngagementStatusType,
  AgentServiceType,
  AgentVolunteerSearchType,
  ApiAgentGet,
  ApiAgentGetList,
  OptionById,
} from "need4deed-sdk";

type AgentListItem = ApiAgentGetList & ApiAgentGet;

export function getNormalizedAgent(agent: AgentListItem): Omit<
  AgentListItem,
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
