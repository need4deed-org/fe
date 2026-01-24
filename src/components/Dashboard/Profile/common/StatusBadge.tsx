import { Paragraph } from "@/components/styled/text";

import React from "react";
import styled from "styled-components";
import { statusBorderRadiusMap, statusColorMap, statusIconMap, statusTextColorMap, StatusValue } from "./statusMaps";

type StatusDivProps = {
  bg?: string;
  $borderRadius?: string;
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
  border-radius: ${(p) => p.$borderRadius || "var(--activity-tag-border-radius)"};
`;

interface StatusBadgeProps {
  status: StatusValue | undefined;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) {
    return null;
  }

  const bg = statusColorMap[status];
  const IconComp = statusIconMap[status];
  const textColor = statusTextColorMap[status];
  const borderRadius = statusBorderRadiusMap[status];

  return (
    <StatusDiv bg={bg} $borderRadius={borderRadius}>
      <IconComp size={20} color={textColor} />
      <Paragraph
        fontWeight="var(--text-h4-font-weight)"
        lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
        color={textColor}
      >
        {String(status)}
      </Paragraph>
    </StatusDiv>
  );
};

export default StatusBadge;
