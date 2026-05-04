import styled from "styled-components";

interface Props {
  variant: "primary" | "outline";
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function ActionButton({ variant, onClick, disabled, children }: Props) {
  return (
    <StyledButton $variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ $variant: "primary" | "outline" }>`
  padding: 12px 32px;
  border-radius: 100px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition:
    opacity 0.2s ease,
    background 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  background: ${({ $variant }) => ($variant === "primary" ? "var(--color-aubergine)" : "transparent")};
  color: ${({ $variant }) => ($variant === "primary" ? "var(--color-white)" : "var(--color-aubergine)")};
  border: ${({ $variant }) => ($variant === "primary" ? "none" : "2px solid var(--color-aubergine)")};

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;
