import type React from "react";
import {
  ArrowsClockwise,
  CalendarBlank,
  CalendarX,
  ChartLine,
  CheckCircle,
  HourglassIcon,
  PhoneX,
  ProhibitInset,
  Sparkle,
  StopCircle,
  Users,
} from "@phosphor-icons/react";
import {
  OpportunityStatusType,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";

export type StatusValue =
  | VolunteerStateEngagementType
  | VolunteerStateTypeType
  | VolunteerStateMatchType
  | OpportunityStatusType;

export const statusColorMap = {
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
  [VolunteerStateTypeType.EVENTS]: "var(--color-blue-500)",
  [VolunteerStateTypeType.REGULAR]: "var(--color-blue-500)",
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: "var(--color-blue-500)",
  // @ts-expect-error missing SDK-implementation
  [OpportunityStatusType.SEARCHING]: "var(--color-violet-100)",
  [OpportunityStatusType.PAST]: "var(--color-grey-50)",
} as const satisfies Record<string, string>;

export const statusIconMap = {
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
  // @ts-expect-error missing SDK-implementation
  [OpportunityStatusType.SEARCHING]: HourglassIcon,
  [OpportunityStatusType.PAST]: StopCircle,
} as const satisfies Record<string, React.ComponentType<{ size?: number; color?: string }>>;
