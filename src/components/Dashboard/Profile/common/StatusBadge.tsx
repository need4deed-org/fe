import React from "react";
import styled from "styled-components";
import {
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import {
  CalendarBlank,
  CalendarX,
  ChartLine,
  FlagIcon,
  HourglassIcon,
  LinkIcon,
  PhoneX,
  Plugs,
  PlugsConnected,
  Sparkle,
  StopCircle,
  Users,
} from "@phosphor-icons/react";
import { Paragraph } from "@/components/styled/text";

/* StatusDiv now accepts a bg prop so background can be set per-status */
const StatusDiv = styled.div<{ bg?: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${(p) => p.bg || "var(--color-white)"};
  height: var(--dashboard-volunteers-card-status-div-height);
  gap: var(--dashboard-volunteers-card-status-div-gap);
  padding: var(--dashboard-volunteers-card-status-div-padding);
  border-radius: var(--activity-tag-border-radius);
`;

type StatusValue = VolunteerStateType | VolunteerStateEngagementType | VolunteerStateTypeType | VolunteerStateMatchType;

interface StatusBadgeProps {
  status: StatusValue;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColorMap: Record<string, string> = {
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
    [VolunteerStateEngagementType.AVAILABLE]: "var(--color-violet-50)",
    [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: "var( --color-red-50)",
    [VolunteerStateEngagementType.UNRESPONSIVE]: "var(--color-grey-50)",
    [VolunteerStateTypeType.ACCOMPANYING]: "var(--color-grey-50)",
    [VolunteerStateTypeType.EVENT]: "var(--color-pink-50)",
    [VolunteerStateTypeType.REGULAR]: "var(--color-grey-50)",
    [VolunteerStateTypeType.FESTIVAL]: "var(--color-grey-50)",
    [VolunteerStateTypeType.WEEKEND_ONLY]: "var(--color-grey-50)",
  };

  const statusIconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
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
    [VolunteerStateTypeType.ACCOMPANYING]: Users,
  };

  const key = status;
  const bg = statusColorMap[key];
  const IconComp = statusIconMap[key];
  const IconEl = <IconComp size={20} />;

  return (
    <StatusDiv bg={bg}>
      {IconEl}
      <Paragraph
        fontSize={"var(--text-p-font-size)"}
        fontWeight="var(--text-h4-font-weight)"
        lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
      >
        {String(status)}
      </Paragraph>
    </StatusDiv>
  );
};

export default StatusBadge;
