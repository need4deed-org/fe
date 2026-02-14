import { ErrorMessage } from "@/components/core/common";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { XCircle } from "@phosphor-icons/react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import styled from "styled-components";
import { HasError } from "@/types";

const EditModeWrapper = styled.div`
  width: 100%;
`;

const FieldWrapper = styled.div<HasError>`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: ${(props) =>
    props.$hasError ? "var(--editableField-fieldWrapper-padding-error)" : "var(--editableField-fieldWrapper-padding)"};
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
  }

  > span {
    flex: 1;
  }

  input {
    border-radius: var(--editableField-fieldWrapper-input-borderRadius);
    padding: var(--editableField-fieldWrapper-input-padding);
    color: var(--color-midnight);
    border: var(--editableField-fieldWrapper-input-border);
    flex: 1;
    min-width: 0;
  }
`;

const InputWrapper = styled.div<HasError>`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;

  input {
    border-radius: var(--editableField-fieldWrapper-input-borderRadius);
    padding: var(--editableField-fieldWrapper-input-padding);
    padding-right: var(--editableField-fieldWrapper-input-paddingRight);
    color: var(--color-midnight);
    border: ${(props) =>
      props.$hasError ? "2px solid var(--color-red-600)" : "var(--editableField-fieldWrapper-input-border)"};
    flex: 1;
    min-width: 0;
    width: 100%;

    &:focus {
      outline: none;
      border: ${(props) => (props.$hasError ? "2px solid var(--color-red-600)" : "2px solid var(--color-green-200)")};
    }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--editableField-clearButton-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-400);
  transition: color 0.2s;

  &:hover {
    color: var(--color-midnight);
  }
`;

const DropdownWrapper = styled.div`
  position: var(--editableField-dropdownWrapper-position);
  width: var(--editableField-dropdownWrapper-width);
  flex: 1;
`;

const DropdownButton = styled.div<{ $hasError?: boolean }>`
  border: ${(props) =>
    props.$hasError ? "2px solid var(--color-red-600)" : "var(--editableField-dropdownButton-border)"};
  padding: var(--editableField-dropdownButton-padding);
  border-radius: var(--editableField-dropdownButton-borderRadius);
  cursor: var(--editableField-dropdownButton-cursor);
  color: var(--color-midnight);
  display: var(--editableField-dropdownButton-display);
  justify-content: var(--editableField-dropdownButton-justifyContent);
  align-items: var(--editableField-dropdownButton-alignItems);
  user-select: var(--editableField-dropdownButton-userSelect);
  transition: border 0.2s ease;

  &:focus-within {
    outline: none;
    border: ${(props) => (props.$hasError ? "2px solid var(--color-red-600)" : "2px solid var(--color-green-200)")};
  }
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
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--editableField-dropdownList-gap);
  max-height: 240px;
  overflow-y: auto;
`;

const OptionRow = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: var(--editableField-optionRow-padding);
  cursor: pointer;
  user-select: none;
  width: 100%;
  border-radius: var(--editableField-optionRow-borderRadius);
  transition: background-color 0.2s ease;
  gap: var(--editableField-optionRow-gap);
  background-color: ${(props) => (props.$isSelected ? "var(--color-orchid-subtle)" : "transparent")};

  &:hover {
    background-color: var(--color-orchid-light);
  }

  input[type="checkbox"],
  input[type="radio"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin: 0;
    flex: 0 0 auto;
    accent-color: var(--color-green-500);
  }
`;

const Text = styled.span`
  flex: 1;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
  cursor: pointer;
  font-size: 16px;
  color: var(--color-midnight);
`;

type EditableFieldType = "text" | "number" | "checkbox-list" | "radio-list";

export interface EditableFieldRef<T> {
  getValue: () => T;
  validate: () => string | null;
}

interface EditableFieldProps<T = string | number | string[]> {
  mode: "display" | "edit";
  type: EditableFieldType;
  label?: string;
  value: T;
  setValue: (value: T) => void;
  submit?: (value: T) => void | Promise<void>;
  validator?: (value: T) => string | null;
  options?: string[];
  errorMessage?: string;
}

export const EditableField = forwardRef(function EditableField<T extends string | number | string[]>(
  {
    mode,
    type,
    label,
    value,
    setValue,
    // submit, // TODO: implement submit (on blur or enter?)
    validator,
    options = [],
    errorMessage,
  }: EditableFieldProps<T>,
  ref: React.Ref<EditableFieldRef<T>>,
) {
  const [error, setError] = useState<string | null>(null);
  const [localValue, setLocalValue] = useState<T>(value);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setLocalValue(value);
    setError(null);
  }, [value]);

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

  const wrapperRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
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
      const displayValue = value.length > 0 ? value.join(", ") : EMPTY_PLACEHOLDER_VALUE;
      return (
        <FieldWrapper>
          {label && <label>{label}</label>}
          <span>{displayValue}</span>
        </FieldWrapper>
      );
    }
    const displayValue = value && String(value).trim().length > 0 ? value : EMPTY_PLACEHOLDER_VALUE;
    return (
      <FieldWrapper>
        {label && <label>{label}</label>}
        <span>{displayValue}</span>
      </FieldWrapper>
    );
  }

  // edit mode
  return (
    <EditModeWrapper>
      <FieldWrapper $hasError={!!errorMessage}>
        {label && <label>{label}</label>}

        {type === "text" && (
          <InputWrapper $hasError={!!errorMessage}>
            <input
              type="text"
              value={localValue}
              onChange={(e) => {
                const v = e.target.value as T;
                setLocalValue(v);
                setValue(v);
              }}
            />
            {Boolean(localValue) && (
              <ClearButton
                type="button"
                onClick={() => {
                  const v = "" as T;
                  setLocalValue(v);
                  setValue(v);
                }}
              >
                <XCircle size={20} weight="bold" />
              </ClearButton>
            )}
          </InputWrapper>
        )}

        {type === "number" && (
          <InputWrapper $hasError={!!errorMessage}>
            <input
              type="number"
              value={localValue as number}
              onChange={(e) => {
                const v = e.target.value as T;
                setLocalValue(v);
                setValue(v);
              }}
            />
            {String(localValue).length > 0 && (
              <ClearButton
                type="button"
                onClick={() => {
                  const v = "" as T;
                  setLocalValue(v);
                  setValue(v);
                }}
              >
                <XCircle size={20} weight="bold" />
              </ClearButton>
            )}
          </InputWrapper>
        )}

        {(type === "checkbox-list" || type === "radio-list") && (
          <DropdownWrapper ref={wrapperRef}>
            <DropdownButton $hasError={!!errorMessage} onClick={() => setOpen((o) => !o)}>
              <span>
                {type === "checkbox-list"
                  ? Array.isArray(localValue) && localValue.length > 0
                    ? localValue.join(", ")
                    : "Select options..."
                  : localValue || "Select option..."}
              </span>

              <Arrow className={open ? "open" : ""} />
            </DropdownButton>

            {open && (
              <DropdownList>
                {options.map((option) => {
                  const isSelected =
                    type === "checkbox-list"
                      ? Array.isArray(localValue) && localValue.includes(option)
                      : localValue === option;
                  return (
                    <OptionRow
                      key={option}
                      $isSelected={isSelected}
                      onClick={() => {
                        if (type === "checkbox-list") {
                          handleCheckboxChange(option);
                        } else {
                          const v = option as T;
                          setLocalValue(v);
                          setValue(v);
                          setOpen(false);
                        }
                      }}
                    >
                      <input
                        type={type === "checkbox-list" ? "checkbox" : "radio"}
                        name={label}
                        value={option}
                        checked={isSelected}
                        onChange={() => {
                          // Handled by parent OptionRow onClick
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Text>{option}</Text>
                    </OptionRow>
                  );
                })}
              </DropdownList>
            )}
          </DropdownWrapper>
        )}
      </FieldWrapper>
      {error && <p style={{ color: "red", paddingLeft: "1rem" }}>{error}</p>}
      {errorMessage && (
        <ErrorMessage message={errorMessage} paddingLeft="var(--editableField-errorMessage-paddingLeft)" />
      )}
    </EditModeWrapper>
  );
});
