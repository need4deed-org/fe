"use client";
import { X, Calendar } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { de, type Locale } from "date-fns/locale";
import { ContactType, ContactMethodType, CommunicationType, ApiCommunicationGet } from "need4deed-sdk";
import { useForm, Controller } from "react-hook-form";
import "react-day-picker/style.css";
import { Modal } from "@/components/core/modal";
import { Button } from "@/components/core/button";
import { getContactTypeLabel } from "./utils/translations";
import { getCommunicationTypeOptions, getContactMethodOptions, getDefaultContactMethod } from "./utils/options";

const DialogHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-32);
  margin-bottom: var(--spacing-32);
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

const Form = styled.form`
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

type FormData = {
  contactType: ContactType;
  contactMethod: ContactMethodType;
  communicationType: CommunicationType;
  date: Date;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ApiCommunicationGet>) => void;
  initialData?: ApiCommunicationGet;
};

export function CommunicationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : undefined;
  
  const { control, handleSubmit, watch, reset, setValue } = useForm<FormData>({
    defaultValues: {
      contactType: undefined, // Will be set by reset
      contactMethod: ContactMethodType.PHONE,
      communicationType: CommunicationType.BRIEF,
      date: new Date(),
    }
  });

  const contactType = watch("contactType");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          contactType: initialData.contactType,
          contactMethod: initialData.contactMethod,
          communicationType: initialData.communicationType || CommunicationType.BRIEF,
          date: new Date(initialData.date),
        });
      } else {
        reset({
            contactType: undefined, // Force user to select
            contactMethod: ContactMethodType.PHONE,
            communicationType: CommunicationType.BRIEF,
            date: new Date(),
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // Update default contact method when contact type changes (if adding new)
  useEffect(() => {
    if (contactType && !initialData) {
        const defaultMethod = getDefaultContactMethod(contactType);
        setValue("contactMethod", defaultMethod);
    }
  }, [contactType, initialData, setValue]);

  const onSubmit = (data: FormData) => {
    const payload: Partial<ApiCommunicationGet> = {
      id: initialData?.id,
      contactType: data.contactType,
      contactMethod: data.contactMethod,
      communicationType: data.contactType === ContactType.OTHER ? data.communicationType : undefined,
      date: data.date,
    };
    onSave(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{t("dashboard.communicationSection.registerContact", "Register contact")}</DialogTitle>
          <CloseButton onClick={onClose} data-testid="close-dialog-button">
            <X size={24} weight="bold" />
          </CloseButton>
        </DialogHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
            {Object.values(ContactType).map((type) => (
                <RadioOption key={type}>
                    <RadioRow>
                        <Controller
                            name="contactType"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <RadioInput
                                    {...field}
                                    type="radio"
                                    value={type}
                                    checked={field.value === type}
                                    // React Hook Form's onChange expects the value
                                    onChange={() => field.onChange(type)} 
                                    data-testid={`radio-${type.toLowerCase().replace(/_/g, "-")}`}
                                />
                            )}
                        />
                        {getContactTypeLabel(t, type)}
                    </RadioRow>
                    
                    {contactType === type && (
                         <>
                         {type === ContactType.OTHER && (
                           <FormField>
                             <Label>{t("dashboard.communicationSection.communicationTypeRequired", "Communication type*")}</Label>
                             <Controller
                                name="communicationType"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} data-testid="communication-type-select">
                                        {getCommunicationTypeOptions(t).map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                        ))}
                                    </Select>
                                )}
                             />
                           </FormField>
                         )}
                         <FormField>
                           <Label>{t("dashboard.communicationSection.contactMethodRequired", "Contact method*")}</Label>
                           <Controller
                                name="contactMethod"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} data-testid="platform-select">
                                        {getContactMethodOptions(t, type).map((option) => (
                                            <option key={option.value} value={option.value}>
                                            {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                         </FormField>
                         <FormField>
                           <Label>{t("dashboard.communicationSection.contactDateRequired", "Contact date*")}</Label>
                           <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <DatePickerWithPopover 
                                        date={field.value} 
                                        onSelect={field.onChange} 
                                        locale={locale} 
                                    />
                                )}
                           />
                         </FormField>
                       </>
                    )}
                </RadioOption>
            ))}

            <ButtonGroup>
                <Button
                    text={t("dashboard.communicationSection.cancel", "Cancel")}
                    onClick={(e) => {
                        e.preventDefault();
                        onClose();
                    }}
                    backgroundcolor="transparent"
                    textColor="var(--color-aubergine)"
                    border="var(--border-width-medium) solid var(--color-aubergine)"
                />
                <Button
                    text={t("dashboard.communicationSection.save", "Save")}
                    onClick={handleSubmit(onSubmit)}
                    backgroundcolor="var(--color-aubergine)"
                    textColor="var(--color-white)"
                    disabled={!contactType}
                />
            </ButtonGroup>
        </Form>
    </Modal>
  );
}

// Extract DatePicker to separate component to handle open state
function DatePickerWithPopover({ date, onSelect, locale }: { date: Date, onSelect: (d: Date | undefined) => void, locale?: Locale }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <DatePickerWrapper ref={containerRef}>
             <DateInputContainer>
                <DateInputIcon size={24} weight="regular" />
                <DateInput
                  value={format(date, "dd.MM.yyyy")}
                  onClick={() => setIsOpen(!isOpen)}
                  readOnly
                  data-testid="date-picker-input"
                />
              </DateInputContainer>
              <DatePickerPopover $isOpen={isOpen}>
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                      onSelect(d);
                      setIsOpen(false);
                  }}
                  locale={locale}
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear() + 10}
                  disabled={{ after: new Date() }}
                />
              </DatePickerPopover>
        </DatePickerWrapper>
    )
}
