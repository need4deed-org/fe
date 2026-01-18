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

export const TypeOption = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  cursor: pointer;
  width: 100%;
`;

export const TypeOptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

export const CheckCircle = styled.div<{ $isSelected?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) => (props.$isSelected ? "var(--color-green-100)" : "transparent")};
  border: ${(props) => (props.$isSelected ? "none" : "2px solid var(--color-grey-400)")};
`;

export const TypeLabel = styled.span<{ $isSelected?: boolean }>`
  font-family: var(--bs-body-font-family);
  font-weight: ${(props) => (props.$isSelected ? "var(--font-weight-semi-bold)" : "var(--font-weight-regular)")};
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: var(--color-midnight);
`;

export const ExpandedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  padding-left: 32px;
  border-left: 4px solid rgba(123, 132, 203, 0.15);
  margin-top: var(--spacing-8);
`;

export const SubQuestion = styled.p`
  font-family: var(--bs-body-font-family);
  font-weight: var(--font-weight-regular);
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: var(--color-grey-700);
  margin: 0;
`;

export const SubOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

export const SubOption = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  cursor: pointer;
`;

export const SubRadioCircle = styled.div<{ $isSelected?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) => (props.$isSelected ? "var(--color-green-100)" : "transparent")};
  border: ${(props) => (props.$isSelected ? "none" : "2px solid var(--color-grey-400)")};
`;

export const SubOptionLabel = styled.span<{ $isSelected?: boolean }>`
  font-family: var(--bs-body-font-family);
  font-weight: ${(props) => (props.$isSelected ? "var(--font-weight-semi-bold)" : "var(--font-weight-regular)")};
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: var(--color-midnight);
`;

export const DateFieldWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: var(--spacing-8);
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: var(--color-grey-50);
  margin: var(--spacing-24) 0;
`;
