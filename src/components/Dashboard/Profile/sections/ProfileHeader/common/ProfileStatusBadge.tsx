import { VolunteerStateTypeType } from "need4deed-sdk";
import styled from "styled-components";
import { isEnumValue } from "ts-type-safe";
import { statusColorMap, statusIconMap, StatusValue } from "../../../common/statusMaps";

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

const DEFAULT_BG = "var(--color-grey-50)";
const DEFAULT_TEXT_COLOR = "var(--color-blue-700)";
const VOLUNTEER_TYPE_TEXT_COLOR = "var(--color-white)";

const isVolunteerType = (status: StatusValue) => isEnumValue(VolunteerStateTypeType, status);

export const ProfileStatusBadge = ({ status, label, showIcon = true }: Props) => {
  const bg = statusColorMap[status] ?? DEFAULT_BG;
  const textColor = isVolunteerType(status) ? VOLUNTEER_TYPE_TEXT_COLOR : DEFAULT_TEXT_COLOR;
  const IconComp = statusIconMap[status];

  return (
    <StyledBadge $bg={bg} $textColor={textColor} data-testid="profile-status-badge">
      {showIcon && IconComp && (
        <IconWrapper>
          <IconComp size={20} color={textColor} weight="fill" />
        </IconWrapper>
      )}
      <span>{label}</span>
    </StyledBadge>
  );
};
