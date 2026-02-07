import { TFunction } from "i18next";
import { AgentEngagementStatus, AgentTrustLevel, AgentVolunteerSearch } from "../../../types/agent";

export const createEngagementStatusLabelMap = (t: TFunction): Record<AgentEngagementStatus, string> => ({
  [AgentEngagementStatus.NEW]: t("dashboard.agentProfile.status.engagement.new"),
  [AgentEngagementStatus.ACTIVE]: t("dashboard.agentProfile.status.engagement.active"),
  [AgentEngagementStatus.INACTIVE]: t("dashboard.agentProfile.status.engagement.inactive"),
});

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
