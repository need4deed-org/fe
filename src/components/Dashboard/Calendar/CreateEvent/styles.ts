import styled from "styled-components";

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

export const FieldLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-midnight);
`;

export const StyledInput = styled.input`
  width: 100%;
  border: 1.5px solid var(--color-grey-400);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--color-midnight);
  background: var(--color-white);
  box-sizing: border-box;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: var(--color-midnight);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }

  &[type="date"],
  &[type="time"] {
    cursor: pointer;
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  border: 1.5px solid var(--color-grey-400);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--color-midnight);
  background: var(--color-white);
  resize: vertical;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    border-color: var(--color-midnight);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }
`;

export const HelperText = styled.p`
  font-size: 12px;
  color: var(--color-grey-500);
  margin: 0;
`;

export const CharCount = styled.p`
  font-size: 12px;
  color: var(--color-grey-500);
  text-align: right;
  margin: 0;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-16);
  margin-top: var(--spacing-8);
`;

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-24);
  padding: var(--spacing-16) 0;
  border-bottom: 1px solid var(--color-grey-200);

  &:last-child {
    border-bottom: none;
  }
`;

export const FieldRowLabel = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: var(--color-midnight);
  min-width: 160px;
`;
