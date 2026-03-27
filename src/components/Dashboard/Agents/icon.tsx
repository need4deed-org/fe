import { CalendarDotsIcon, MapPinIcon, ShootingStarIcon, HandPalmIcon } from "@phosphor-icons/react";
import { AgentEngagementStatusType, AgentServiceType, AgentTrustType, AgentVolunteerSearchType } from "need4deed-sdk";
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

export const createVolunteerSearchMap = (t: TFunction): Record<AgentVolunteerSearchType, string> => ({
  [AgentVolunteerSearchType.SEARCHING]: t("dashboard.agentProfile.status.volunteerSearch.searching"),
  [AgentVolunteerSearchType.NOT_NEEDED]: t("dashboard.agentProfile.status.volunteerSearch.notNeeded"),
  [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: t("dashboard.agentProfile.status.volunteerSearch.filled"),
});

export const createTrustLevelMap = (t: TFunction): Record<AgentTrustType, string> => ({
  [AgentTrustType.UNKNOWN]: t("dashboard.agentProfile.status.trustLevel.unknown"),
  [AgentTrustType.LOW]: t("dashboard.agentProfile.status.trustLevel.low"),
  [AgentTrustType.HIGH]: t("dashboard.agentProfile.status.trustLevel.high"),
});

export const createServiceTypeMap = (t: TFunction): Record<AgentServiceType, string> => ({
  [AgentServiceType.CHILDCARE]: t("dashboard.agentProfile.status.serviceType.childcare"),
  [AgentServiceType.CONSULTATION]: t("dashboard.agentProfile.status.serviceType.consultation"),
  [AgentServiceType.JOB_COACHING]: t("dashboard.agentProfile.status.serviceType.jobCoaching"),
  [AgentServiceType.REFUGEE_ACCOMMODATION]: t("dashboard.agentProfile.status.serviceType.refugeeAccommodation"),
  [AgentServiceType.SPORT]: t("dashboard.agentProfile.status.serviceType.sport"),
  [AgentServiceType.TANDEM]: t("dashboard.agentProfile.status.serviceType.tandem"),
  [AgentServiceType.TUTORING]: t("dashboard.agentProfile.status.serviceType.tutoring"),
  [AgentServiceType.VOLUNTARY_SUPPORT]: t("dashboard.agentProfile.status.serviceType.volunteerSupport"),
  [AgentServiceType.WELFARE]: t("dashboard.agentProfile.status.serviceType.welfare"),
  [AgentServiceType.YOUTH]: t("dashboard.agentProfile.status.serviceType.youth"),
});
