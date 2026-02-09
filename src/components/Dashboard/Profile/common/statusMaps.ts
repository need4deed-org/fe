import type React from "react";
import {
  ArrowsClockwiseIcon,
  BinocularsIcon,
  CalendarBlankIcon,
  CalendarXIcon,
  ChartLineIcon,
  CheckCircleIcon,
  HandPalmIcon,
  HourglassIcon,
  PhoneXIcon,
  ProhibitInsetIcon,
  QuestionIcon,
  SmileyIcon,
  SmileySadIcon,
  SparkleIcon,
  StopCircleIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import {
  OpportunityMatchStatus,
  OpportunityStatusType,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import { AgentEngagementStatus, AgentTrustLevel, AgentVolunteerSearch } from "../types/agent";

export type StatusValue =
  | VolunteerStateEngagementType
  | VolunteerStateTypeType
  | VolunteerStateMatchType
  | OpportunityStatusType
  | OpportunityMatchStatus
  | AgentEngagementStatus
  | AgentVolunteerSearch
  | AgentTrustLevel;

export const statusColorMap: Record<string, string> = {
  [VolunteerStateEngagementType.ACTIVE]: "var(--color-green-100)",
  [VolunteerStateEngagementType.AVAILABLE]: "var(--color-violet-100)",
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: "var( --color-red-50)",
  [VolunteerStateEngagementType.UNRESPONSIVE]: "var(--color-grey-50)",
  [VolunteerStateEngagementType.INACTIVE]: "var(--color-grey-50)",
  [VolunteerStateEngagementType.NEW]: "var(--color-green-100)",
  [OpportunityMatchStatus.UNMATCHED]: "var(--color-grey-50)",
  [OpportunityMatchStatus.MATCHED]: "var(--color-green-100)",
  [OpportunityMatchStatus.NEEDS_REMATCH]: "var(--color-red-50)",
  [VolunteerStateMatchType.PENDING_MATCH]: "var(--color-violet-100)",
  [VolunteerStateTypeType.ACCOMPANYING]: "var(--color-blue-500)",
  [VolunteerStateTypeType.EVENTS]: "var(--color-blue-500)",
  [VolunteerStateTypeType.REGULAR]: "var(--color-blue-500)",
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: "var(--color-blue-500)",
  [OpportunityStatusType.SEARCHING]: "var(--color-violet-100)",
  [OpportunityStatusType.PAST]: "var(--color-grey-50)",
  [AgentVolunteerSearch.NOT_NEEDED]: "var(--color-grey-50)",
  [AgentVolunteerSearch.FILLED]: "var(--color-green-100)",
  [AgentVolunteerSearch.SEARCHING]: "var(--color-red-50)",
  [AgentTrustLevel.UNKNOWN]: "var(--color-grey-50)",
  [AgentTrustLevel.LOW]: "var(--color-red-50)",
  [AgentTrustLevel.HIGH]: "var(--color-green-100)",
};

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

export const statusIconMap: Record<string, IconComponent> = {
  [VolunteerStateEngagementType.ACTIVE]: ChartLineIcon,
  [VolunteerStateEngagementType.AVAILABLE]: CalendarBlankIcon,
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: CalendarXIcon,
  [VolunteerStateEngagementType.UNRESPONSIVE]: PhoneXIcon,
  [VolunteerStateEngagementType.INACTIVE]: StopCircleIcon,
  [VolunteerStateEngagementType.NEW]: SparkleIcon,
  [OpportunityMatchStatus.UNMATCHED]: ProhibitInsetIcon,
  [OpportunityMatchStatus.MATCHED]: CheckCircleIcon,
  [OpportunityMatchStatus.NEEDS_REMATCH]: ArrowsClockwiseIcon,
  [VolunteerStateMatchType.PENDING_MATCH]: HourglassIcon,
  [VolunteerStateTypeType.ACCOMPANYING]: UsersIcon,
  [VolunteerStateTypeType.EVENTS]: UsersIcon,
  [VolunteerStateTypeType.REGULAR]: UsersIcon,
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: UsersIcon,
  [OpportunityStatusType.SEARCHING]: HourglassIcon,
  [OpportunityStatusType.PAST]: StopCircleIcon,
  [AgentVolunteerSearch.NOT_NEEDED]: HandPalmIcon,
  [AgentVolunteerSearch.FILLED]: CheckCircleIcon,
  [AgentVolunteerSearch.SEARCHING]: BinocularsIcon,
  [AgentTrustLevel.UNKNOWN]: QuestionIcon,
  [AgentTrustLevel.LOW]: SmileySadIcon,
  [AgentTrustLevel.HIGH]: SmileyIcon,
};
