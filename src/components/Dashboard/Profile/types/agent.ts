export enum AgentEngagementStatus {
  NEW = "new",
  ACTIVE = "active",
  UNRESPONSIVE = "unresponsive",
  INACTIVE = "inactive",
}

export enum AgentVolunteerSearch {
  NOT_NEEDED = "not_needed",
  NEEDED = "needed",
  SEARCHING = "searching",
}

export enum AgentTrustLevel {
  UNKNOWN = "unknown",
  LOW = "low",
  HIGH = "high",
}

export type ApiAgentProfileGet = {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  statusEngagement: AgentEngagementStatus;
  volunteerSearch: AgentVolunteerSearch;
  trustLevel: AgentTrustLevel;
};
