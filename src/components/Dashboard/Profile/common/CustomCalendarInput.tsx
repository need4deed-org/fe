import React from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarBlank } from "@phosphor-icons/react";

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 16px auto;
`;

const InputLabel = styled.label`
  position: absolute;
  top: -8px;
  left: 16px;
  background: white;
  padding: 0 4px;
  font-size: 12px;
  color: #6b7280;
  z-index: 1;
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
    border-color: #1e40af;
  }
`;

const Icon = styled.span`
  margin-right: 8px;
  color: #6b7280;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker__input-container input {
    border: none;
    outline: none;
    font-size: 14px;
    background: transparent;
    color: #374151;
    cursor: pointer;
  }

  .react-datepicker__header {
    background-color: #f3f4f6;
  }
`;

interface CustomCalendarInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
  className?: string;
  inputClassName?: string;
  datePickerClassName?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  inputProps?: React.HTMLAttributes<HTMLDivElement>;
}

const CustomCalendarInput: React.FC<CustomCalendarInputProps> = ({
  value,
  onChange,
  label,
  className,
  inputClassName,
  datePickerClassName,
  containerProps,
  inputProps,
}) => {
  return (
    <InputContainer className={className} {...containerProps}>
      <InputLabel>{label}</InputLabel>
      <InputField className={inputClassName} {...inputProps}>
        <Icon>
          <CalendarBlank />
        </Icon>
        <DatePickerWrapper>
          <DatePicker
            className={datePickerClassName}
            selected={value}
            onChange={onChange}
            dateFormat="dd.MM.yyyy"
            placeholderText="Select a date"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </DatePickerWrapper>
      </InputField>
    </InputContainer>
  );
};

export default CustomCalendarInput;
