import { AgentRoles } from "@/config/constants";
import { TimedText } from "need4deed-sdk";

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
  comments?: TimedText[];
  contactDetails?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    role?: AgentRoles[];
    phone?: string;
    email?: string;
    landline?: string;
  };
  organisationDetails?: {
    about?: string;
    website?: string;
    address?: string;
    organisationType?: string;
    operator?: string;
    services?: string;
    clientLanguages?: Array<{ id: number; title: string }>;
  };
};
