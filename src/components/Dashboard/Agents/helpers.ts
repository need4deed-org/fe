import { AgentEngagementStatusType, AgentVolunteerSearchType, ApiAgentGet, OptionById } from "need4deed-sdk";

export function getNormalizedAgent(agent: ApiAgentGet): Omit<
  ApiAgentGet,
  "district" | "statusEngagement" | "volunteerSearch"
> & {
  district: OptionById | undefined;
  statusEngagement: AgentEngagementStatusType;
  volunteerSearch: AgentVolunteerSearchType;
} {
  return {
    ...agent,
    district: agent.district,
    statusEngagement: agent.statusEngagement,
    volunteerSearch: agent.volunteerSearch,
  };
}
