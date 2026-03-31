import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import styled from "styled-components";

const StyledPlaceholder = styled.span`
  color: var(--color-grey-500);
`;

export const EmptyPlaceholder = () => (
  <StyledPlaceholder data-testid="empty-placeholder">
    {EMPTY_PLACEHOLDER_VALUE}
  </StyledPlaceholder>
);
