import { statusColorMap, statusIconMap, StatusValue } from "./statusMaps";
import { DEFAULT_BG, DEFAULT_TEXT_COLOR, IconWrapper, StyledBadge } from "./styles";

type Props = {
  status: StatusValue;
  label: string;
  showIcon?: boolean;
};

export const StatusBadge = ({ status, label, showIcon = true }: Props) => {
  const bg = statusColorMap[status] ?? DEFAULT_BG;
  const textColor = DEFAULT_TEXT_COLOR;
  const IconComp = statusIconMap[status];

  return (
    <StyledBadge $bg={bg} $textColor={textColor} data-testid="profile-status-badge">
      {showIcon && IconComp && (
        <IconWrapper>
          <IconComp size={20} color={textColor} />
        </IconWrapper>
      )}
      <span>{label}</span>
    </StyledBadge>
  );
};
