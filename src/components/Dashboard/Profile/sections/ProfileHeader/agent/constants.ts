import { TFunction } from "i18next";
import { AgentEngagementStatus, AgentTrustLevel, AgentVolunteerSearch } from "../../../types/agent";

export const createEngagementStatusLabelMap = (t: TFunction): Record<AgentEngagementStatus, string> => ({
  [AgentEngagementStatus.NEW]: t("dashboard.agentProfile.status.engagement.new"),
  [AgentEngagementStatus.ACTIVE]: t("dashboard.agentProfile.status.engagement.active"),
  [AgentEngagementStatus.UNRESPONSIVE]: t("dashboard.agentProfile.status.engagement.unresponsive"),
  [AgentEngagementStatus.INACTIVE]: t("dashboard.agentProfile.status.engagement.inactive"),
});

export const AGENT_DIALOG_STATUSES = [AgentEngagementStatus.UNRESPONSIVE, AgentEngagementStatus.INACTIVE] as const;

export const AGENT_ENGAGEMENT_DESCRIPTION_KEYS: Record<(typeof AGENT_DIALOG_STATUSES)[number], string> = {
  [AgentEngagementStatus.UNRESPONSIVE]: "unresponsive_description",
  [AgentEngagementStatus.INACTIVE]: "inactive_description",
};

export const createVolunteerSearchLabelMap = (t: TFunction): Record<AgentVolunteerSearch, string> => ({
  [AgentVolunteerSearch.NOT_NEEDED]: t("dashboard.agentProfile.status.volunteerSearch.notNeeded"),
  [AgentVolunteerSearch.NEEDED]: t("dashboard.agentProfile.status.volunteerSearch.needed"),
  [AgentVolunteerSearch.SEARCHING]: t("dashboard.agentProfile.status.volunteerSearch.searching"),
});

export const createTrustLevelLabelMap = (t: TFunction): Record<AgentTrustLevel, string> => ({
  [AgentTrustLevel.UNKNOWN]: t("dashboard.agentProfile.status.trustLevel.unknown"),
  [AgentTrustLevel.LOW]: t("dashboard.agentProfile.status.trustLevel.low"),
  [AgentTrustLevel.MEDIUM]: t("dashboard.agentProfile.status.trustLevel.medium"),
  [AgentTrustLevel.HIGH]: t("dashboard.agentProfile.status.trustLevel.high"),
});
