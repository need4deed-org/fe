import { Check } from "@phosphor-icons/react";
import styled from "styled-components";

type Props = {
  isSelected: boolean;
  label: string;
  onClick: () => void;
  "data-testid"?: string;
};

const Container = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  cursor: pointer;
`;

const Circle = styled.div<{ $isSelected?: boolean }>`
  width: var(--selectable-option-circle-size);
  height: var(--selectable-option-circle-size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) =>
    props.$isSelected ? "var(--color-green-100)" : "transparent"};
  border: ${(props) =>
    props.$isSelected ? "none" : "var(--border-width-medium) solid var(--color-grey-400)"};
`;

const Label = styled.span<{ $isSelected?: boolean }>`
  font-family: var(--bs-body-font-family);
  font-weight: ${(props) =>
    props.$isSelected
      ? "var(--font-weight-semi-bold)"
      : "var(--font-weight-regular)"};
  font-size: var(--selectable-option-font-size);
  line-height: var(--selectable-option-line-height);
  letter-spacing: var(--selectable-option-letter-spacing);
  color: var(--color-midnight);
`;

export function SelectableOption({
  isSelected,
  label,
  onClick,
  "data-testid": testId,
}: Props) {
  return (
    <Container $isSelected={isSelected} onClick={onClick} data-testid={testId}>
      <Circle $isSelected={isSelected}>
        {isSelected && (
          <Check size={14} weight="bold" color="var(--color-midnight)" />
        )}
      </Circle>
      <Label $isSelected={isSelected}>{label}</Label>
    </Container>
  );
}
