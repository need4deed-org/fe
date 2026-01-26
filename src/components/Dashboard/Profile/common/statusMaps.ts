import type React from "react";
import {
  ArrowsClockwise,
  CalendarBlank,
  CalendarX,
  ChartLine,
  CheckCircle,
  FlagIcon,
  HourglassIcon,
  LinkIcon,
  PhoneX,
  Plugs,
  PlugsConnected,
  ProhibitInset,
  Sparkle,
  StopCircle,
  Users,
} from "@phosphor-icons/react";
import {
  OpportunityStatusType,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateType,
  VolunteerStateTypeType,
} from "need4deed-sdk";

export type StatusValue =
  | VolunteerStateType
  | VolunteerStateEngagementType
  | VolunteerStateTypeType
  | VolunteerStateMatchType
  | OpportunityStatusType;

export const statusColorMap = {
  [VolunteerStateType.NEW]: "var(--color-green-100)",
  [VolunteerStateType.MATCHED]: "var(--color-green-100)",
  [VolunteerStateType.OPPORTUNITY_SENT]: "var(--color-amber-300)",
  [VolunteerStateType.ACTIVE_REGULAR]: "var(--color-green-100)",
  [VolunteerStateType.ACTIVE_ACCOMPANY]: "var(--color-indigo-500)",
  [VolunteerStateType.ACTIVE_FEST]: "var(--color-pink-500)",
  [VolunteerStateType.TO_REMATCH]: "var(--color-yellow-500)",
  [VolunteerStateType.TEMP_INACTIVE]: "var(--color-gray-400)",
  [VolunteerStateType.INACTIVE]: "var(--color-grey-50)",
  [VolunteerStateEngagementType.ACTIVE]: "var(--color-green-100)",
  [VolunteerStateEngagementType.AVAILABLE]: "var(--color-violet-100)",
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: "var( --color-red-50)",
  [VolunteerStateEngagementType.UNRESPONSIVE]: "var(--color-grey-50)",
  [VolunteerStateEngagementType.INACTIVE]: "var(--color-grey-50)",
  [VolunteerStateEngagementType.NEW]: "var(--color-green-100)",
  [VolunteerStateMatchType.NO_MATCHES]: "var(--color-grey-50)",
  [VolunteerStateMatchType.PENDING_MATCH]: "var(--color-violet-100)",
  [VolunteerStateMatchType.MATCHED]: "var(--color-green-100)",
  [VolunteerStateMatchType.NEEDS_REMATCH]: "var(--color-red-50)",
  [VolunteerStateTypeType.ACCOMPANYING]: "var(--color-blue-500)",
  [VolunteerStateTypeType.EVENTS]: "var(--color-blue-50)",
  [VolunteerStateTypeType.REGULAR]: "var(--color-blue-50)",
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: "var(--color-blue-50)",
  [OpportunityStatusType.PAST]: "var(--color-grey-50)",
} as const satisfies Record<string, string>;

export const statusIconMap = {
  [VolunteerStateType.NEW]: Sparkle,
  [VolunteerStateType.MATCHED]: PlugsConnected,
  [VolunteerStateType.OPPORTUNITY_SENT]: FlagIcon,
  [VolunteerStateType.ACTIVE_REGULAR]: LinkIcon,
  [VolunteerStateType.ACTIVE_ACCOMPANY]: HourglassIcon,
  [VolunteerStateType.ACTIVE_FEST]: HourglassIcon,
  [VolunteerStateType.TO_REMATCH]: Plugs,
  [VolunteerStateType.TEMP_INACTIVE]: HourglassIcon,
  [VolunteerStateType.INACTIVE]: StopCircle,
  [VolunteerStateEngagementType.ACTIVE]: ChartLine,
  [VolunteerStateEngagementType.AVAILABLE]: CalendarBlank,
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: CalendarX,
  [VolunteerStateEngagementType.UNRESPONSIVE]: PhoneX,
  [VolunteerStateEngagementType.INACTIVE]: StopCircle,
  [VolunteerStateEngagementType.NEW]: Sparkle,
  [VolunteerStateMatchType.NO_MATCHES]: ProhibitInset,
  [VolunteerStateMatchType.PENDING_MATCH]: HourglassIcon,
  [VolunteerStateMatchType.MATCHED]: CheckCircle,
  [VolunteerStateMatchType.NEEDS_REMATCH]: ArrowsClockwise,
  [VolunteerStateTypeType.ACCOMPANYING]: Users,
  [VolunteerStateTypeType.EVENTS]: Users,
  [VolunteerStateTypeType.REGULAR]: Users,
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: Users,
  [OpportunityStatusType.PAST]: StopCircle,
} as const satisfies Record<string, React.ComponentType<{ size?: number; color?: string }>>;

