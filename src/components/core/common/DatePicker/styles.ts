import { Calendar } from "@phosphor-icons/react";
import styled from "styled-components";

export const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;

  .rdp {
    --rdp-accent-color: var(--color-aubergine);
    --rdp-accent-background-color: var(--color-aubergine);
    --rdp-background-color: var(--color-aubergine-subtle);
    margin: 0;
    font-family: var(--bs-body-font-family);
  }

  .rdp-day_button {
    width: var(--communication-tracker-date-picker-day-size);
    height: var(--communication-tracker-date-picker-day-size);
    border-radius: var(--border-radius-xs);
  }

  .rdp-selected .rdp-day_button {
    background-color: var(--color-aubergine);
    color: var(--color-white);
    font-weight: var(--font-weight-semi-bold);
  }

  .rdp-day_button:hover:not([disabled]) {
    background-color: var(--color-aubergine-subtle);
  }
`;

export const DateInputContainer = styled.div<{ $hasLabel?: boolean }>`
  position: relative;
  width: 100%;
  ${(props) => props.$hasLabel && `margin-top: 10px;`}
`;

export const FloatingLabel = styled.span`
  position: absolute;
  top: -10px;
  left: 12px;
  background: var(--color-white);
  padding: 0 4px;
  font-family: var(--bs-body-font-family);
  font-weight: var(--font-weight-regular);
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.08px;
  color: var(--color-midnight);
  z-index: 1;
`;

export const DateInputIcon = styled(Calendar)`
  position: absolute;
  left: var(--spacing-16);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-midnight);
  cursor: pointer;
  z-index: 1;
`;

export const DateInput = styled.input`
  width: 100%;
  padding: var(--spacing-16);
  padding-left: 52px;
  padding-right: 44px;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.1px;
  font-weight: var(--font-weight-regular);
  color: var(--color-midnight);
  font-family: var(--bs-body-font-family);
  cursor: text;
  background: var(--color-white);

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }

  &:hover {
    border-color: var(--color-grey-400);
  }
`;

export const DropdownIcon = styled.div`
  position: absolute;
  right: var(--spacing-16);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-midnight);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const DatePickerPopover = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1100;
  background: var(--color-white);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  box-shadow: 0px 10px 30px -12px rgba(143, 81, 138, 0.2);
  padding: var(--spacing-16);
`;
