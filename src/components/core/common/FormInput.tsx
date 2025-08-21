import styled from "styled-components";
import { ChangeEvent } from "react";
import { Paragraph } from "@/components/styled/text";
import { WarningCircleIcon } from "@phosphor-icons/react";

const FormInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--form-input-error-message-container-gap);
  padding: var(--form-input-error-message-container-padding);
`;

interface StyledInputProps {
  type: string;
  width?: string;
  $backgroundColor?: string;
}
const StyledInput = styled.input<StyledInputProps>`
  color: var(--color-midnight);
  font-size: var(--form-input-fontSize);
  height: var(--form-input-container-height);
  width: ${(props) => props.width || "-webkit-fill-available"};
  background-color: ${(props) => props.$backgroundColor || "var(--color-white)"};
  border-radius: var(--form-input-container-border-radius);
  padding: var(--form-input-container-padding);
  border: var(--form-input-container-border);

  &:focus {
    outline: none;
    border: var(--form-input-container-border-focus);
  }
`;

interface Props {
  type?: string;
  placeHolder?: string;
  onInputChange: (input: string) => void;
  width?: string;
  backgroundColor?: string;
  value?: string;
  errors?: (string | undefined)[];
}

export function FormInput({
  placeHolder = "Input",
  value = "",
  type = "input",
  onInputChange,
  width,
  backgroundColor,
  errors,
}: Props) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  return (
    <FormInputContainer>
      <StyledInput
        placeholder={placeHolder}
        value={value}
        onChange={handleInputChange}
        type={type}
        width={width}
        $backgroundColor={backgroundColor}
      />

      {errors &&
        errors.length > 0 &&
        errors
          .filter((e) => e)
          .map((error) => (
            <ErrorMessageContainer key={error}>
              <WarningCircleIcon size={20} color="var(--form-input-error-message-color)" />
              <Paragraph
                color="var(--form-input-error-message-color)"
                fontSize="var(--form-input-error-message-fontSize)"
                fontWeight="var(--form-input-error-message-fontWeight)"
                lineheight="var(--form-input-error-message-lineHeight)"
              >
                {error}
              </Paragraph>
            </ErrorMessageContainer>
          ))}
    </FormInputContainer>
  );
}

export default FormInput;
