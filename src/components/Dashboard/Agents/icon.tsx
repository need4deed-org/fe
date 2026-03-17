import { CalendarDotsIcon, MapPinIcon, ShootingStarIcon, HandPalmIcon } from "@phosphor-icons/react";
import { AgentEngagementStatusType, AgentType, AgentVolunteerSearchType } from "need4deed-sdk";
import { JSX } from "react";

import { TFunction } from "i18next";

export enum IconName {
  ShootingStar = "shootingStar",
  CalendarDots = "calendarDots",
  MapPin = "mapPin",
  HandPalmIcon = "handPalm",
}

type IconMap = {
  [key in IconName]: JSX.Element;
};

export const iconNameMap: IconMap = {
  [IconName.ShootingStar]: <ShootingStarIcon />,
  [IconName.CalendarDots]: <CalendarDotsIcon />,
  [IconName.MapPin]: <MapPinIcon />,
  [IconName.HandPalmIcon]: <HandPalmIcon />,
};

export const createEngagementStatusLabelMap = (t: TFunction): Record<AgentEngagementStatusType, string> => ({
  [AgentEngagementStatusType.NEW]: t("dashboard.agentProfile.status.engagement.new"),
  [AgentEngagementStatusType.ACTIVE]: t("dashboard.agentProfile.status.engagement.active"),
  [AgentEngagementStatusType.UNRESPONSIVE]: t("dashboard.agentProfile.status.engagement.unresponsive"),
  [AgentEngagementStatusType.INACTIVE]: t("dashboard.agentProfile.status.engagement.inactive"),
});

export const createAgentTypeMap = (t: TFunction): Record<AgentType, string> => ({
  [AgentType.AE]: t("dashboard.agents.filters.type.ae"),
  [AgentType.ASOG]: t("dashboard.agents.filters.type.asog"),
  [AgentType.COUNSELING_CENTER]: t("dashboard.agents.filters.type.counseling-center"),
  [AgentType.GU1]: t("dashboard.agents.filters.type.gu1"),
  [AgentType.GU2]: t("dashboard.agents.filters.type.gu2"),
  [AgentType.GU2_PLUS]: t("dashboard.agents.filters.type.gu2+"),
  [AgentType.GU3]: t("dashboard.agents.filters.type.gu3"),
  [AgentType.MULTIPLE_SOCIAL_SUPPORT]: t("dashboard.agents.filters.type.multiple-social-support"),
  [AgentType.NU]: t("dashboard.agents.filters.type.nu"),
  [AgentType.TANDEM]: t("dashboard.agents.filters.type.tandem"),
});

export const createVolunteerSearchMap = (t: TFunction): Record<AgentVolunteerSearchType, string> => ({
  [AgentVolunteerSearchType.SEARCHING]: t("dashboard.agentProfile.status.volunteerSearch.searching"),
  [AgentVolunteerSearchType.NOT_NEEDED]: t("dashboard.agentProfile.status.volunteerSearch.notNeeded"),
  [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: t("dashboard.agentProfile.status.volunteerSearch.filled"),
});
