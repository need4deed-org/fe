import { Paragraph } from "@/components/styled/text";
import { VolunteerStateTypeType } from "need4deed-sdk";
import React from "react";
import styled from "styled-components";
import { statusColorMap, statusIconMap, StatusValue } from "./statusMaps";

type StatusDivProps = {
  bg?: string;
};

const StatusDiv = styled.div<StatusDivProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${(p) => p.bg || "var(--color-white)"};
  height: var(--dashboard-volunteers-card-status-div-height);
  gap: var(--dashboard-volunteers-card-status-div-gap);
  padding: var(--dashboard-volunteers-card-status-div-padding);
  border-radius: var(--border-radius-xs);
`;

interface StatusBadgeProps {
  status: StatusValue | undefined;
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  if (!status) {
    return null;
  }

  const bg = statusColorMap[status];
  const IconComp = statusIconMap[status];
  const textColor = status === VolunteerStateTypeType.ACCOMPANYING ? "var(--color-white)" : "var(--color-blue-700)";

  return (
    <StatusDiv bg={bg} data-testid="status-badge">
      <IconComp size={20} color={textColor} />
      <Paragraph
        fontWeight="var(--text-h4-font-weight)"
        lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
        color={textColor}
      >
        {label}
      </Paragraph>
    </StatusDiv>
  );
};

export default StatusBadge;
