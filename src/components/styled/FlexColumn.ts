import styled from "styled-components";

interface FlexColumnProps {
  $gap?: string | number;
  $alignItems?: string;
  $width?: string;
}

export const FlexColumn = styled.div<FlexColumnProps>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$gap ?? "0"};
  align-items: ${(props) => props.$alignItems ?? "flex-start"};
  width: ${(props) => props.$width ?? "auto"};
`;
