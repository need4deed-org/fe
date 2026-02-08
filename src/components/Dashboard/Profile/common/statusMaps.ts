import type React from "react";
import {
  ArrowsClockwiseIcon,
  CalendarBlankIcon,
  CalendarXIcon,
  ChartLineIcon,
  CheckCircleIcon,
  HourglassIcon,
  PhoneXIcon,
  ProhibitInsetIcon,
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

export type StatusValue =
  | VolunteerStateEngagementType
  | VolunteerStateTypeType
  | VolunteerStateMatchType
  | OpportunityStatusType
  | OpportunityMatchStatus;

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
};
