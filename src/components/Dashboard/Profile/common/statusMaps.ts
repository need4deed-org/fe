import type React from "react";
import {
  ArrowsClockwise,
  CalendarBlank,
  CalendarX,
  ChartLine,
  CheckCircle,
  Eye,
  HourglassIcon,
  PhoneX,
  ProhibitInset,
  Question,
  ShieldCheck,
  ShieldWarning,
  Sparkle,
  StopCircle,
  Users,
  XCircle,
} from "@phosphor-icons/react";
import {
  OpportunityMatchStatus,
  OpportunityStatusType,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import { AgentEngagementStatus, AgentTrustLevel, AgentVolunteerSearch } from "../types/agent";

// Agent engagement status values ("new", "active", "inactive") and AgentVolunteerSearch.SEARCHING ("searching")
// share the same runtime string values as existing SDK enums, so they reuse those map entries.

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
  [AgentVolunteerSearch.NEEDED]: "var(--color-violet-100)",
  [AgentTrustLevel.UNKNOWN]: "var(--color-grey-50)",
  [AgentTrustLevel.LOW]: "var(--color-red-50)",
  [AgentTrustLevel.MEDIUM]: "var(--color-violet-100)",
  [AgentTrustLevel.HIGH]: "var(--color-green-100)",
};

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

export const statusIconMap: Record<string, IconComponent> = {
  [VolunteerStateEngagementType.ACTIVE]: ChartLine,
  [VolunteerStateEngagementType.AVAILABLE]: CalendarBlank,
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: CalendarX,
  [VolunteerStateEngagementType.UNRESPONSIVE]: PhoneX,
  [VolunteerStateEngagementType.INACTIVE]: StopCircle,
  [VolunteerStateEngagementType.NEW]: Sparkle,
  [OpportunityMatchStatus.UNMATCHED]: ProhibitInset,
  [OpportunityMatchStatus.MATCHED]: CheckCircle,
  [OpportunityMatchStatus.NEEDS_REMATCH]: ArrowsClockwise,
  [VolunteerStateMatchType.PENDING_MATCH]: HourglassIcon,
  [VolunteerStateTypeType.ACCOMPANYING]: Users,
  [VolunteerStateTypeType.EVENTS]: Users,
  [VolunteerStateTypeType.REGULAR]: Users,
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: Users,
  [OpportunityStatusType.SEARCHING]: HourglassIcon,
  [OpportunityStatusType.PAST]: StopCircle,
  [AgentVolunteerSearch.NOT_NEEDED]: XCircle,
  [AgentVolunteerSearch.NEEDED]: Eye,
  [AgentTrustLevel.UNKNOWN]: Question,
  [AgentTrustLevel.LOW]: ShieldWarning,
  [AgentTrustLevel.MEDIUM]: ShieldCheck,
  [AgentTrustLevel.HIGH]: ShieldCheck,
};
