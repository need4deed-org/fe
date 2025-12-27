import { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  children: ReactNode;
};

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

export function DialogButtonGroup({ children }: Props) {
  return <Container>{children}</Container>;
}

export const CancelButton = styled.button`
  font-family: "Figtree", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-aubergine);
  background: transparent;
  border: 2px solid var(--color-aubergine);
  border-radius: 125px;
  padding: 12px 32px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-aubergine-subtle);
  }
`;

export const PrimaryCancelButton = styled(CancelButton)`
  font-size: 24px;
  line-height: 32px;
  padding: 16px 48px;
`;

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  font-family: "Figtree", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-white);
  background: ${(props) => (props.$disabled ? "#D1D5DB" : "var(--color-aubergine)")};
  border: 2px solid ${(props) => (props.$disabled ? "#D1D5DB" : "var(--color-aubergine)")};
  border-radius: 125px;
  padding: 12px 32px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$disabled ? "#D1D5DB" : "var(--color-aubergine-light)")};
    border-color: ${(props) => (props.$disabled ? "#D1D5DB" : "var(--color-aubergine-light)")};
  }
`;

export const LargePrimaryButton = styled(PrimaryButton)`
  font-size: 24px;
  line-height: 32px;
  padding: 16px 48px;
`;
