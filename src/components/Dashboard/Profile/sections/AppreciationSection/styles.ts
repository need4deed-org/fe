import { Calendar } from "@phosphor-icons/react";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-24);
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

export const EmptyState = styled.div`
  width: 100%;
  padding: var(--spacing-48) var(--spacing-24);
  text-align: center;
  color: var(--color-grey-500);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
`;

export const StatusBadge = styled.div<{ $status: "received" | "pending" }>`
  background: ${(props) =>
    props.$status === "received"
      ? "var(--color-green-100)"
      : "var(--color-red-50)"};
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
`;

export const DialogHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-32);
  margin-bottom: var(--spacing-32);
`;

export const DialogTitle = styled.h3`
  font-weight: var(--font-weight-bold);
  font-size: 28px;
  line-height: 32px;
  letter-spacing: 0.14px;
  color: var(--color-midnight);
  margin: 0 0 var(--spacing-24) 0;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);

  &:hover {
    opacity: var(--opacity-hover);
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  width: 100%;
`;

export const Label = styled.label`
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-16);
  line-height: var(--line-height-20);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
`;

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

export const DateInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const DateInputIcon = styled(Calendar)`
  position: absolute;
  left: var(--communication-tracker-input-icon-offset);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-aubergine);
  cursor: pointer;
  z-index: 1;
`;

export const DateInput = styled.input`
  width: 100%;
  padding: var(--spacing-16);
  padding-left: var(--communication-tracker-input-padding-left);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  font-weight: var(--font-weight-regular);
  color: var(--color-aubergine);
  font-family: var(--bs-body-font-family);
  cursor: text;
  background: var(--color-white);

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }
`;

export const DatePickerPopover = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1100;
  background: var(--color-white);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  box-shadow: var(--communication-tracker-popover-box-shadow);
  padding: var(--spacing-16);
`;

export const Select = styled.select`
  width: 100%;
  padding: var(--spacing-16);
  padding-right: var(--communication-tracker-input-padding-left);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  font-weight: var(--font-weight-regular);
  color: var(--color-aubergine);
  font-family: var(--bs-body-font-family);
  background: var(--color-white);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%23403168' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right var(--communication-tracker-input-icon-offset) center;
  background-size: var(--communication-tracker-dropdown-arrow-size);

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--spacing-16);
  margin-top: auto;
  padding-top: var(--spacing-16);
`;

export const RadioOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  width: 100%;
`;

export const RadioOption = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  cursor: pointer;
  width: 100%;
`;

export const RadioInput = styled.input`
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: var(--color-midnight);
  flex-shrink: 0;
  margin: 0;
`;

export const RadioLabel = styled.span`
  font-family: var(--bs-body-font-family);
  font-weight: var(--font-weight-regular);
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: var(--color-midnight);
`;
