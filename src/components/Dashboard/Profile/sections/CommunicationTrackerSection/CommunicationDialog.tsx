"use client";
import { X, Calendar } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { de, type Locale } from "date-fns/locale";
import { ContactType, ContactMethodType, CommunicationType, ApiCommunicationGet } from "need4deed-sdk";
import "react-day-picker/style.css";
import { getContactTypeLabel } from "./utils/translations";
import { getCommunicationTypeOptions, getContactMethodOptions, getDefaultContactMethod } from "./utils/options";

const DialogOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-dimmed-background);
  z-index: 10001;
  justify-content: center;
  align-items: center;
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-48);
  gap: var(--spacing-32);
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  box-shadow: var(--communication-tracker-dialog-box-shadow);
  max-width: var(--communication-tracker-dialog-max-width);
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const DialogHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-32);
`;

const DialogTitle = styled.h3`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-32);
  line-height: var(--line-height-40);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);

  &:hover {
    opacity: var(--opacity-hover);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;

const RadioOption = styled.label`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--spacing-20);
  cursor: pointer;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  font-weight: var(--font-weight-regular);
`;

const RadioRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

const RadioInput = styled.input`
  width: var(--communication-tracker-radio-size);
  height: var(--communication-tracker-radio-size);
  cursor: pointer;
  accent-color: var(--color-aubergine);
  flex-shrink: 0;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  width: 100%;
`;

const Label = styled.label`
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-16);
  line-height: var(--line-height-20);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
`;

const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;

  .rdp {
    --rdp-accent-color: var(--color-aubergine);
    --rdp-accent-background-color: var(--color-aubergine);
    --rdp-background-color: var(--color-aubergine-subtle);
    margin: 0;
    font-family: var(--bs-body-font-family);
  }

  .rdp-day_button {
    width: var(--communication-tracker-date-picker-day-size);
    height: var(--communication-tracker-date-picker-day-size);
    border-radius: var(--border-radius-xs);
  }

  .rdp-selected .rdp-day_button {
    background-color: var(--color-aubergine);
    color: var(--color-white);
    font-weight: var(--font-weight-semi-bold);
  }

  .rdp-day_button:hover:not([disabled]) {
    background-color: var(--color-aubergine-subtle);
  }

  .rdp-outside {
    color: var(--color-grey-300);
  }

  .rdp-nav {
    display: flex;
    gap: var(--spacing-8);
  }

  .rdp-nav_button {
    width: var(--communication-tracker-date-picker-nav-button-size);
    height: var(--communication-tracker-date-picker-nav-button-size);
    border-radius: var(--border-radius-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    border: none;
    color: var(--color-midnight);
  }

  .rdp-nav_button:hover {
    background-color: var(--color-grey-100);
  }

  .rdp-caption_label {
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-16);
    color: var(--color-midnight);
  }

  .rdp-weekday {
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-14);
    color: var(--color-midnight);
  }

  .rdp-month_caption {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-8);
  }

  .rdp-dropdowns {
    display: flex;
    gap: var(--spacing-8);
    align-items: center;
  }

  .rdp-dropdown {
    padding: var(--communication-tracker-dropdown-item-padding);
    border: var(--border-width-thin) solid var(--color-grey-200);
    border-radius: var(--border-radius-xs);
    background: var(--color-white);
    font-family: var(--bs-body-font-family);
    cursor: pointer;
  }
`;

const DateInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DateInputIcon = styled(Calendar)`
  position: absolute;
  left: var(--communication-tracker-input-icon-offset);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-aubergine);
  pointer-events: none;
  z-index: 1;
`;

const DateInput = styled.input`
  width: 100%;
  padding: var(--spacing-16);
  padding-left: var(--communication-tracker-input-padding-left);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  font-weight: var(--font-weight-regular);
  color: var(--color-aubergine);
  font-family: var(--bs-body-font-family);
  cursor: pointer;
  background: var(--color-white);

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }

  &::placeholder {
    color: var(--color-grey-500);
  }
`;

const DatePickerPopover = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: absolute;
  bottom: calc(100% + var(--spacing-8));
  left: 0;
  z-index: 1000;
  background: var(--color-white);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  box-shadow: var(--communication-tracker-popover-box-shadow);
  padding: var(--spacing-16);
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-16);
  padding-right: var(--communication-tracker-input-padding-left);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  font-weight: var(--font-weight-regular);
  color: var(--color-aubergine);
  font-family: var(--bs-body-font-family);
  background: var(--color-white);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%23403168' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right var(--communication-tracker-input-icon-offset) center;
  background-size: var(--communication-tracker-dropdown-arrow-size);

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--spacing-16);
  margin-top: var(--spacing-16);
`;

const CancelButton = styled.button`
  padding: var(--spacing-16) var(--spacing-24);
  background: transparent;
  border: var(--border-width-medium) solid var(--color-aubergine);
  border-radius: var(--button-border-radius);
  cursor: pointer;
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-aubergine);
  font-family: var(--bs-body-font-family);

  &:hover {
    background: var(--color-aubergine-subtle);
  }
`;

const SaveButton = styled.button`
  padding: var(--spacing-16) var(--spacing-24);
  background: var(--color-aubergine);
  border: none;
  border-radius: var(--button-border-radius);
  cursor: pointer;
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-white);
  font-family: var(--bs-body-font-family);

  &:hover {
    background: var(--color-aubergine-light);
  }

  &:disabled {
    background: var(--color-grey-200);
    color: var(--color-grey-500);
    cursor: not-allowed;
    opacity: var(--opacity-disabled);
  }
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ApiCommunicationGet>) => void;
  initialData?: ApiCommunicationGet;
};

export function CommunicationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t, i18n } = useTranslation();
  const [contactType, setContactType] = useState<ContactType | "">("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [contactMethod, setContactMethod] = useState<ContactMethodType>(ContactMethodType.PHONE);
  const [communicationType, setCommunicationType] = useState<CommunicationType>(CommunicationType.BRIEF);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setContactType(initialData.contactType);
        setSelectedDate(new Date(initialData.date));
        setContactMethod(initialData.contactMethod);
        setCommunicationType(initialData.communicationType || CommunicationType.BRIEF);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (contactType !== "") {
      const defaultMethod = getDefaultContactMethod(contactType);
      if (!initialData) {
        setContactMethod(defaultMethod);
      }
    }
  }, [contactType, initialData]);

  const resetForm = () => {
    setContactType("");
    setSelectedDate(new Date());
    setContactMethod(ContactMethodType.PHONE);
    setCommunicationType(CommunicationType.BRIEF);
    setIsDatePickerOpen(false);
  };

  const handleSave = () => {
    if (!contactType) return;

    const data: Partial<ApiCommunicationGet> = {
      id: initialData?.id,
      contactType,
      contactMethod,
      communicationType: contactType === ContactType.OTHER ? communicationType : undefined,
      date: selectedDate,
    };

    onSave(data);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
    setIsDatePickerOpen(false);
  };

  const locale = i18n.language === "de" ? de : undefined;

  return (
    <DialogOverlay $isOpen={isOpen} onClick={handleClose} data-testid="communication-dialog-overlay">
      <DialogContainer onClick={(e) => e.stopPropagation()} data-testid="communication-dialog-container">
        <DialogHeader>
          <DialogTitle>{t("dashboard.communicationSection.registerContact", "Register contact")}</DialogTitle>
          <CloseButton onClick={handleClose} data-testid="close-dialog-button">
            <X size={24} weight="bold" />
          </CloseButton>
        </DialogHeader>

        <RadioGroup>
          {Object.values(ContactType).map((type) => (
            <ContactTypeOption
              key={type}
              type={type}
              isSelected={contactType === type}
              onSelect={setContactType}
              contactMethod={contactMethod}
              onContactMethodChange={setContactMethod}
              communicationType={communicationType}
              onCommunicationTypeChange={setCommunicationType}
              selectedDate={selectedDate}
              isDatePickerOpen={isDatePickerOpen}
              onDatePickerToggle={() => setIsDatePickerOpen(!isDatePickerOpen)}
              onDateSelect={handleDateSelect}
              datePickerRef={datePickerRef}
              locale={locale}
            />
          ))}
        </RadioGroup>

        <ButtonGroup>
          <CancelButton onClick={handleClose} data-testid="cancel-button">
            {t("dashboard.communicationSection.cancel", "Cancel")}
          </CancelButton>
          <SaveButton onClick={handleSave} data-testid="save-button" disabled={!contactType}>
            {t("dashboard.communicationSection.save", "Save")}
          </SaveButton>
        </ButtonGroup>
      </DialogContainer>
    </DialogOverlay>
  );
}

type ContactTypeOptionProps = {
  type: ContactType;
  isSelected: boolean;
  onSelect: (type: ContactType) => void;
  contactMethod: ContactMethodType;
  onContactMethodChange: (method: ContactMethodType) => void;
  communicationType: CommunicationType;
  onCommunicationTypeChange: (type: CommunicationType) => void;
  selectedDate: Date;
  isDatePickerOpen: boolean;
  onDatePickerToggle: () => void;
  onDateSelect: (date: Date | undefined) => void;
  datePickerRef: React.RefObject<HTMLDivElement | null>;
  locale: Locale | undefined;
};

function ContactTypeOption({
  type,
  isSelected,
  onSelect,
  contactMethod,
  onContactMethodChange,
  communicationType,
  onCommunicationTypeChange,
  selectedDate,
  isDatePickerOpen,
  onDatePickerToggle,
  onDateSelect,
  datePickerRef,
  locale,
}: ContactTypeOptionProps) {
  const { t } = useTranslation();
  const testId = `radio-${type.toLowerCase().replace(/_/g, "-")}`;

  return (
    <RadioOption>
      <RadioRow>
        <RadioInput
          type="radio"
          name="contactType"
          value={type}
          checked={isSelected}
          onChange={() => onSelect(type)}
          data-testid={testId}
        />
        {getContactTypeLabel(t, type)}
      </RadioRow>
      {isSelected && (
        <>
          {type === ContactType.OTHER && (
            <FormField>
              <Label>{t("dashboard.communicationSection.communicationTypeRequired", "Communication type*")}</Label>
              <Select
                value={communicationType}
                onChange={(e) => onCommunicationTypeChange(e.target.value as CommunicationType)}
                data-testid="communication-type-select"
              >
                {getCommunicationTypeOptions(t).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
          <FormField>
            <Label>{t("dashboard.communicationSection.contactMethodRequired", "Contact method*")}</Label>
            <Select
              value={contactMethod}
              onChange={(e) => onContactMethodChange(e.target.value as ContactMethodType)}
              data-testid="platform-select"
            >
              {getContactMethodOptions(t, type).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label>{t("dashboard.communicationSection.contactDateRequired", "Contact date*")}</Label>
            <DatePickerWrapper ref={datePickerRef}>
              <DateInputContainer>
                <DateInputIcon size={24} weight="regular" />
                <DateInput
                  value={format(selectedDate, "dd.MM.yyyy")}
                  onClick={onDatePickerToggle}
                  readOnly
                  data-testid="date-picker-input"
                />
              </DateInputContainer>
              <DatePickerPopover $isOpen={isDatePickerOpen}>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateSelect}
                  locale={locale}
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear() + 10}
                  disabled={{ after: new Date() }}
                />
              </DatePickerPopover>
            </DatePickerWrapper>
          </FormField>
        </>
      )}
    </RadioOption>
  );
}
