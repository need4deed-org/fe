import { WarningCircle } from "@phosphor-icons/react";
import styled from "styled-components";

const StyledErrorMessage = styled.div`
  color: var(--color-red-600);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--profile-section-error-gap);
  margin-top: var(--spacing-8);
`;

type Props = {
  message: string;
  paddingLeft?: string;
};

export function ErrorMessage({ message, paddingLeft = "0" }: Props) {
  return (
    <StyledErrorMessage style={{ paddingLeft }}>
      <WarningCircle size={20} weight="fill" />
      {message}
    </StyledErrorMessage>
  );
}
