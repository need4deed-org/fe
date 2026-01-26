import {VolunteerStateTypeType} from "need4deed-sdk";
import styled from "styled-components";
import {statusColorMap, statusIconMap, StatusValue} from "./statusMaps";

const StyledBadge = styled.div<{
  $bg: string;
  $textColor: string;
}>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  width: fit-content;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $textColor }) => $textColor};
`;

const IconWrapper = styled.span`
  width: var(--status-badge-icon-size);
  height: var(--status-badge-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  status: StatusValue;
  label: string;
  showIcon?: boolean;
};

export const ProfileStatusBadge = ({ status, label, showIcon = true }: Props) => {
  const bg = statusColorMap[status] ?? "var(--color-grey-50)";
  const IconComp = statusIconMap[status];
  const textColor =
    status === VolunteerStateTypeType.ACCOMPANYING ? "var(--color-white)" : "var(--color-blue-700)";

  return (
    <StyledBadge
      $bg={bg}
      $textColor={textColor}
      data-testid="profile-status-badge"
    >
      {showIcon && IconComp && (
        <IconWrapper>
          <IconComp size={20} color={textColor} />
        </IconWrapper>
      )}
      <span>{label}</span>
    </StyledBadge>
  );
};
