import { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  children: ReactNode;
};

const Container = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: var(--document-dialog-button-gap);
  align-self: flex-end;
`;

export function DialogButtonGroup({ children }: Props) {
  return <Container>{children}</Container>;
}

export const CancelButton = styled.button`
  font-weight: var(--document-dialog-button-font-weight);
  font-size: var(--document-dialog-button-font-size);
  line-height: var(--document-dialog-button-line-height);
  color: var(--color-aubergine);
  background: transparent;
  border: var(--document-dialog-button-border-width) solid var(--color-aubergine);
  border-radius: var(--document-dialog-button-border-radius);
  padding: var(--document-dialog-button-padding);
  cursor: pointer;
  transition: var(--transition-all);

  &:hover {
    background: var(--color-aubergine-subtle);
  }
`;

export const PrimaryCancelButton = styled(CancelButton)`
  font-size: var(--document-dialog-button-large-font-size);
  line-height: var(--document-dialog-button-large-line-height);
  padding: var(--document-dialog-button-large-padding);
`;

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  font-weight: var(--document-dialog-button-font-weight);
  font-size: var(--document-dialog-button-font-size);
  line-height: var(--document-dialog-button-line-height);
  color: var(--color-white);
  background: ${(props) => (props.$disabled ? "var(--document-dialog-button-disabled-color)" : "var(--color-aubergine)")};
  border: var(--document-dialog-button-border-width) solid ${(props) => (props.$disabled ? "var(--document-dialog-button-disabled-color)" : "var(--color-aubergine)")};
  border-radius: var(--document-dialog-button-border-radius);
  padding: var(--document-dialog-button-padding);
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: var(--transition-all);

  &:hover {
    background: ${(props) => (props.$disabled ? "var(--document-dialog-button-disabled-color)" : "var(--color-aubergine-light)")};
    border-color: ${(props) => (props.$disabled ? "var(--document-dialog-button-disabled-color)" : "var(--color-aubergine-light)")};
  }
`;

export const LargePrimaryButton = styled(PrimaryButton)`
  font-size: var(--document-dialog-button-large-font-size);
  line-height: var(--document-dialog-button-large-line-height);
  padding: var(--document-dialog-button-large-padding);
`;
