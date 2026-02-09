import styled from "styled-components";
import { TableContainer } from "@/components/core/common/Table";

export const CommunicationTableContainer = styled(TableContainer)`
  margin-top: var(--spacing-24);
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
  font-size: var(--font-size-32);
  line-height: var(--line-height-40);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  margin: 0;
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

export const RadioOption = styled.label`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--spacing-20);
  cursor: pointer;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  font-weight: var(--font-weight-regular);
`;

export const RadioRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

export const RadioInput = styled.input`
  appearance: none;
  width: var(--communication-tracker-radio-size);
  height: var(--communication-tracker-radio-size);
  border: var(--border-width-medium) solid var(--color-grey-400);
  border-radius: var(--percent-50);
  cursor: pointer;
  position: relative;
  flex-shrink: 0;

  &:checked {
    background-color: var(--color-green-200);
    border-color: var(--color-green-200);

    &::after {
      content: "";
      position: absolute;
      width: var(--communication-tracker-checkmark-width);
      height: var(--communication-tracker-checkmark-height);
      border: solid var(--color-blue-700);
      border-width: var(--communication-tracker-checkmark-border-width);
      top: var(--percent-50);
      left: var(--percent-50);
      transform: var(--communication-tracker-checkmark-transform);
    }
  }
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
