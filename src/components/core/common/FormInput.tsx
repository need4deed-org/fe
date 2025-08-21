import styled from "styled-components";
import { ChangeEvent } from "react";

interface FormInputContainerProps {
  width?: string;
  $backgroundColor?: string;
}

const FormInputContainer = styled.div<FormInputContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: var(--form-input-container-height);
  width: ${(props) => props.width || "-webkit-fill-available"};
  background-color: ${(props) => props.$backgroundColor || "var(--color-white)"};
  border-radius: var(--form-input-container-border-radius);
  align-items: center;
  padding: var(--form-input-container-padding);
  border: var(--form-input-container-border);
`;

const StyledInput = styled.input`
  color: var(--color-midnight);
  font-size: var(--form-input-fontSize);
  border: none;
  background: transparent;

  &:focus {
    outline: none;
  }
`;

interface Props {
  placeHolder?: string;
  onInputChange: (input: string) => void;
  width?: string;
  backgroundColor?: string;
  value?: string;
}

export function FormInput({ placeHolder = "Input", value = "", onInputChange, width, backgroundColor }: Props) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  return (
    <FormInputContainer width={width} $backgroundColor={backgroundColor}>
      <StyledInput placeholder={placeHolder} value={value} onChange={handleInputChange} />
    </FormInputContainer>
  );
}

export default FormInput;
