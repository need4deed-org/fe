import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { X } from "@phosphor-icons/react";
import styled from "styled-components";

const EditModeWrapper = styled.div`
  width: 100%;
`;

const FieldWrapper = styled.div`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: var(--editableField-fieldWrapper-padding);
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

const InputWrapper = styled.div<{ $hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;

  input {
    border-radius: var(--editableField-fieldWrapper-input-borderRadius);
    padding: var(--editableField-fieldWrapper-input-padding);
    padding-right: 48px;
    color: var(--color-midnight);
    border: ${(props) =>
      props.$hasError ? "2px solid var(--color-red-600)" : "var(--editableField-fieldWrapper-input-border)"};
    flex: 1;
    min-width: 0;
    width: 100%;

    &:focus {
      outline: none;
      border: ${(props) =>
        props.$hasError ? "2px solid var(--color-red-600)" : "2px solid var(--color-green-200)"};
    }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
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
  hasError?: boolean;
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
    hasError = false,
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
    );
  }

  // edit mode
  return (
    <EditModeWrapper>
      <FieldWrapper>
        {label && <label>{label}: </label>}

        {type === "text" && (
          <InputWrapper $hasError={hasError}>
            <input
              type="text"
              value={localValue as string}
              onChange={(e) => {
                const v = e.target.value as T;
                setLocalValue(v);
                setValue(v);
              }}
            />
            {(localValue as string).length > 0 && (
              <ClearButton
                type="button"
                onClick={() => {
                  const v = "" as T;
                  setLocalValue(v);
                  setValue(v);
                }}
              >
                <X size={20} weight="bold" />
              </ClearButton>
            )}
          </InputWrapper>
        )}

        {type === "number" && (
          <InputWrapper $hasError={hasError}>
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
                <X size={20} weight="bold" />
              </ClearButton>
            )}
          </InputWrapper>
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

              <Arrow className={open ? "open" : ""} />
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
    </EditModeWrapper>
  );
});
