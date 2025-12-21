import { Paragraph } from "@/components/styled/text";

import React from "react";
import styled from "styled-components";
import { statusColorMap, statusIconMap, StatusValue } from "./statusMaps";

/* StatusDiv now accepts a bg prop so background can be set per-status */
interface StatusDivProps {
  bg?: string;
}

const StatusDiv = styled.div<StatusDivProps>`
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

interface StatusBadgeProps {
  status: StatusValue | undefined;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) {
    return null;
  }

  const bg = statusColorMap[status as keyof typeof statusColorMap];
  const IconComp = statusIconMap[status as keyof typeof statusColorMap];

  return (
    <StatusDiv bg={bg}>
      <IconComp size={20} />
      <Paragraph
        fontWeight="var(--text-h4-font-weight)"
        lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
      >
        {String(status)}
      </Paragraph>
    </StatusDiv>
  );
};

export default StatusBadge;
