import React, { useState, useImperativeHandle, forwardRef } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";

 const FieldWrapper = styled.div`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: var(--editableField-fieldWrapper-padding);
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);

  label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    }

  input {
    border-radius: var(--editableField-fieldWrapper-input-borderRadius);
    width: var(--editableField-fieldWrapper-input-width);
    padding: var(--editableField-fieldWrapper-input-padding);
    color: var(--color-midnight);
    border: var(--editableField-fieldWrapper-input-border);
    }
  `;

  const DropdownWrapper = styled.div`
  position: var(--editableField-dropdownWrapper-position);
  width: var(--editableField-dropdownWrapper-width);
`;

const DropdownButton = styled.div`
  border: var(--editableField-dropdownButton-border);
  padding: var(--editableField-dropdownButton-padding);
  border-radius: var(--editableField-dropdownButton-borderRadius);
  cursor: var(--editableField-dropdownButton-cursor);
  color: var(--color-midnight);
  display: var(--editableField-dropdownButton-display);
  justify-content: var(--editableField-dropdownButton-justifyContent);
  align-items: var(--editableField-dropdownButton-alignItems);
  user-select: var(--editableField-dropdownButton-userSelect);
`;

const Arrow = styled(IoIosArrowDown)`
  transition: var(--editableField-arrow-transition);
  transform: var(--editableField-arrow-transform);

  &.open {
    transform: var(--editableField-arrow-open-transform);
  }
`;

const DropdownList = styled.div`
  position: var(--editableField-dropdownList-position);
  top: var(--editableField-dropdownList-top);
  left: var(--editableField-dropdownList-left);
  width: var(--editableField-dropdownList-width);
  background: var(--editableField-dropdownList-background);
  border: var(--editableField-dropdownList-border);
  border-radius: var(--editableField-dropdownList-borderRadius);
  padding: var(--editableField-dropdownList-padding);
  z-index: var(--editableField-dropdownList-zIndex);
`;

const OptionRow = styled.div`
  display: var(--editableField-optionRow-display);
  align-items: var(--editableField-optionRow-alignItems);
  justify-content: var(--editableField-optionRow-justifyContent);
  padding: var(--editableField-optionRow-padding);
  cursor: var(--editableField-optionRow-cursor);
  user-select: var(--editableField-optionRow-userSelect);
  width: var(--editableField-optionRow-width);

  input {
  width: var(--editableField-optionRow-input-width);
  }
  
`;

const Text = styled.span`
  flex: var(--editableField-text-flex);
  margin-left: var(--editableField-text-marginLeft);
  white-space: var(--editableField-text-whiteSpace);
  overflow-wrap: var(--editableField-text-overflow);
  word-break: var(--editableField-text-wordBreak);
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


