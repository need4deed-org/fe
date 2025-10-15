import React from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarBlank } from "@phosphor-icons/react";

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  position: absolute;
  top: -8px;
  left: 16px;
  background: white; /* Matches the background color */
  padding: 0 4px;
  font-size: 12px;
  color: #6b7280;
  z-index: 1; /* Ensures the label is above the border */
`;

const InputField = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  position: relative;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus-within {
    border-color: #1e40af; /* Highlight border when focused */
  }
`;

const Icon = styled.span`
  margin-right: 8px;
  color: #6b7280;
`;

const StyledDatePicker = styled(DatePicker)`
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  color: #374151;
  background: transparent;
  cursor: pointer;
`;

interface CustomCalendarInputProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label: string;
}

const CustomCalendarInput: React.FC<CustomCalendarInputProps> = ({ value, onChange, label }) => {
  return (
    <InputContainer>
      <InputLabel>{label}</InputLabel>
      <InputField>
        <Icon>
          <CalendarBlank />
        </Icon>
        <StyledDatePicker
          selected={value}
          onChange={onChange}
          dateFormat="dd.MM.yyyy"
          placeholderText="Select a date"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </InputField>
    </InputContainer>
  );
};

export default CustomCalendarInput;
