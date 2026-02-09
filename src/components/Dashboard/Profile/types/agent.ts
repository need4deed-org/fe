export enum AgentEngagementStatus {
  NEW = "new",
  ACTIVE = "active",
  UNRESPONSIVE = "unresponsive",
  INACTIVE = "inactive",
}

export enum AgentVolunteerSearch {
  NOT_NEEDED = "not_needed",
  FILLED = "filled",
  SEARCHING = "volunteer_searching",
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
