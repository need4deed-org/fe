import React from "react";
import styled from "styled-components";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  renderComponent?: React.ReactNode; 
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RadioOptionContainer = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  margin-right: 0.5rem;
  width: 20px;
  height: 20px;
`;

const RadioLabel = styled.span`
  font-weight: 400;
  font-size: 16px;
`;

const RadioDescription = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
`;

const RadioNodeList = styled.div`
  display: flex;
  align-items: center;
`;

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange }) => {
  return (
    <RadioGroupContainer>
      {options.map((option) => (
        <RadioOptionContainer key={option.value}>
          <RadioNodeList>
            <RadioInput
              type="radio"
              name="radio-group"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
            />
            <RadioLabel>{option.label}</RadioLabel>
          </RadioNodeList>
          {option.description && <RadioDescription>{option.description}</RadioDescription>}
          {selectedValue === option.value && option.renderComponent && <div>{option.renderComponent}</div>}
        </RadioOptionContainer>
      ))}
    </RadioGroupContainer>
  );
};

export default RadioGroup;
