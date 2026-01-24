import styled from "styled-components";

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-gap);
  padding: 0;
  height: 100%;
`;

export const ModalTitle = styled.h3`
  font-size: var(--dialog-title-font-size);
  font-weight: var(--font-weight-bold);
  line-height: var(--dialog-title-line-height);
  letter-spacing: var(--dialog-title-letter-spacing);
  color: var(--color-blue-700);
  margin: 0;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-gap);
`;

export const OptionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-option-gap);
`;

export const RadioOption = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dialog-option-gap);
  cursor: pointer;

  input[type="radio"] {
    appearance: none;
    width: var(--dialog-radio-size);
    height: var(--dialog-radio-size);
    border: var(--dialog-radio-border-width) solid var(--color-grey-400);
    border-radius: var(--percent-50);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;

    &:checked {
      border-color: var(--color-blue-700);

      &::after {
        content: "";
        position: absolute;
        width: var(--spacing-12);
        height: var(--spacing-12);
        border-radius: var(--percent-50);
        background-color: var(--color-blue-700);
        top: var(--percent-50);
        left: var(--percent-50);
        transform: translate(-50%, -50%);
      }
    }
  }
`;

export const OptionLabel = styled.span`
  font-size: var(--dialog-label-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--dialog-label-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  flex: 1;
`;

export const OptionDescription = styled.p`
  font-size: var(--dialog-description-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--dialog-description-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-grey-700);
  margin: 0;
`;

export const DateFieldContainer = styled.div`
  margin-top: var(--spacing-8);
`;
