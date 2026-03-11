import styled from "styled-components";

export const StyledBadge = styled.div<{
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

export const IconWrapper = styled.span`
  width: var(--status-badge-icon-size);
  height: var(--status-badge-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DEFAULT_BG = "var(--color-grey-50)";
export const DEFAULT_TEXT_COLOR = "var(--color-blue-700)";
