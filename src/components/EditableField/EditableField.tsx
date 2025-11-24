import React, { useState, useImperativeHandle, forwardRef } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";

 const FieldWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #EBEDF7;
  padding: 1rem;
  color: #1A2684;
  font-size: 1.2rem;
  width: 100%;
  align-items: center;
  justify-content: flex-start;

  label {
    font-weight: bold;
    width: 10rem
    }

  input {
    border-radius: 1rem;
    width: 100%;
    padding: 0.5rem;
    color:#1A2684;
    border-color: #1A2684;}
  `;

  const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.div`
  border: 1px solid #1A2684;
  padding: 0.7rem 1rem;
  border-radius: 1rem;
  cursor: pointer;
  color: #1A2684;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
`;

const Arrow = styled(IoIosArrowDown)`
  transition: 0.2s;
  transform: rotate(0deg);

  &.open {
    transform: rotate(180deg);
  }
`;

const DropdownList = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #1A2684;
  border-radius: 0.8rem;
  padding: 0.7rem;
  z-index: 20;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.2rem;
  cursor: pointer;
  user-select: none;
  width: 100%;

  input {
  width: 10%
  }
  
`;

const Text = styled.span`
  flex: 1;
  margin-left: 0.7rem;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
`;

type EditableFieldType = "text" | "number" | "checkbox-list" | "radio-list";

export interface EditableFieldRef<T = any> {
  getValue: () => T;
  validate: () => string | null;
}

interface EditableFieldProps<T = string | number | string[]> {
  mode: "display" | "edit",
  type: EditableFieldType,
  label?: string,
  value: T,
  setValue: (value: T) => void,
  submit?: (value: T) => void | Promise<void>,
  validator?: (value: T) => string | null,
  options?: string[],
}

export const EditableField = forwardRef(function EditableField<T extends string | number | string[]>(
  {
  mode,
  type,
  label,
  value,
  setValue,
  submit,
  validator,
  options = [],
}: EditableFieldProps<T>,
ref: React.Ref<EditableFieldRef<T>>) {

  const [error, setError] = useState<string | null>(null);
  const [localValue, setLocalValue] = useState<T>(value);
  const [open, setOpen] = useState<boolean>(false);

  React.useEffect(() => {
    setLocalValue(value);
    setError(null);
  }, [value])

  useImperativeHandle(ref, () => ({
    getValue: () => localValue,
    validate: () => {
      if (!validator) return null;
      const validationError = validator(localValue);
      setError(validationError);
      return validationError;
    },
  }));

  const handleCheckboxChange = (option: string) => {
    if (!Array.isArray(localValue)) return;
    let newValue: string[];
    if (localValue.includes(option)) {
      newValue = localValue.filter((v) => v !== option);
    } else {
      newValue = [...localValue, option];
    }
    setLocalValue(newValue as T);
    setValue(newValue as T);
  };

  const wrapperRef = React.useRef<HTMLDivElement>(null);

// close dropdown on outside click
React.useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  if (mode === "display") {
    if (type === "checkbox-list" && Array.isArray(value)) {
      return (
        <FieldWrapper>
          {label && <label>{label}: </label>}
          <span>{(value as string[]).join(", ")}</span>
        </FieldWrapper> 
      );
    }
    return (
      <FieldWrapper>
        {label && <label>{label}: </label>}
        <span>{value}</span>
      </FieldWrapper>
    )
  }

  // edit mode
  return (
    <div>
      <FieldWrapper>
      {label && <label>{label}: </label>}

      {type === "text" && (
        <input
          type="text"
          value={localValue as string}
          onChange={(e) => {
            const v = e.target.value as T;
            setLocalValue(v);
            setValue(v);
          }}
        />
      )}

      {type === "number" && (
        <input
          type="number"
          value={localValue as number}
          onChange={(e) => {
            const v = e.target.value as T;
            setLocalValue(v);
            setValue(v);
          }}
        />
      )}

{(type === "checkbox-list" || type === "radio-list") && (
  <DropdownWrapper ref={wrapperRef}>
    <DropdownButton onClick={() => setOpen((o) => !o)}>
      <span>
        {type === "checkbox-list"
          ? Array.isArray(localValue) && localValue.length > 0
            ? localValue.join(", ")
            : "Select options..."
          : localValue || "Select option..."}
      </span>

      <Arrow className={open ? "open" : ""}/>
    </DropdownButton>

    {open && (
      <DropdownList>
        {options.map((option) => (
            <OptionRow key={option}>
            <input
              type={type === "checkbox-list" ? "checkbox" : "radio"}
              name={label}
              value={option}
              checked={
                type === "checkbox-list"
                  ? Array.isArray(localValue) && localValue.includes(option)
                  : localValue === option
              }
              onChange={() => {
                if (type === "checkbox-list") {
                  handleCheckboxChange(option);
                } else {
                  const v = option as T;
                  setLocalValue(v);
                  setValue(v);
                  setOpen(false);
                }
              }}
            />
            <Text>{option}</Text>
          </OptionRow>
          
        ))}
      </DropdownList>
    )}
  </DropdownWrapper>
)}


    </FieldWrapper>
    {error && <p style={{ color: "red", paddingLeft: "1rem" }}>{error}</p>}
    </div>
  )
})


