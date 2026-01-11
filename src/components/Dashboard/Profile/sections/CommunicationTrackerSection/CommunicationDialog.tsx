"use client";
import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "@phosphor-icons/react";
import { format, isValid, parse } from "date-fns";
import { de, type Locale } from "date-fns/locale";
import { ApiCommunicationGet, CommunicationType, ContactMethodType, ContactType } from "need4deed-sdk";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ButtonGroup,
  CloseButton,
  DateInput,
  DateInputContainer,
  DateInputIcon,
  DatePickerPopover,
  DatePickerWrapper,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  Label,
  RadioInput,
  RadioOption,
  RadioRow,
  Select,
} from "./styles";
import { getCommunicationTypeOptions, getContactMethodOptions, getDefaultContactMethod } from "./utils/options";
import { getContactTypeLabel } from "./utils/translations";
import { CommunicationFormData, createValidationSchema } from "./utils/validation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ApiCommunicationGet>) => void;
  initialData?: ApiCommunicationGet;
};

export function CommunicationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : undefined;

  const schema = createValidationSchema(t);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isValid: isFormValid },
  } = useForm<CommunicationFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      contactType: undefined,
      contactMethod: ContactMethodType.PHONE,
      communicationType: CommunicationType.BRIEF,
      date: new Date(),
    },
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
          contactType: undefined,
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

  const onSubmit = (data: CommunicationFormData) => {
    if (!data.contactType || !data.date) return;

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
                    <Label>
                      {t("dashboard.communicationSection.communicationTypeRequired", "Communication type*")}
                    </Label>
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
                      <DatePickerWithPopover date={field.value} onSelect={field.onChange} locale={locale} />
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
            disabled={!isFormValid || !contactType}
          />
        </ButtonGroup>
      </Form>
    </Modal>
  );
}

// Extract DatePicker to separate component to handle open state
function DatePickerWithPopover({
  date,
  onSelect,
  locale,
}: {
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  locale?: Locale;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState<Date>(date || new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Do not update input value while user is typing (input is focused)
    if (document.activeElement === inputRef.current) return;

    if (date) {
      setInputValue(format(date, "dd.MM.yyyy"));
    } else {
      setInputValue("");
    }
  }, [date]);

  useEffect(() => {
    if (isOpen && date && isValid(date)) {
      setMonth(date);
    }
  }, [isOpen, date]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Strict regex for d.m.yyyy or dd.mm.yyyy
    const dateRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

    if (!dateRegex.test(value)) {
      onSelect(undefined);
      return;
    }

    const parsedDate = parse(value, "dd.MM.yyyy", new Date());

    if (isValid(parsedDate) && parsedDate.getFullYear() >= 2025) {
      onSelect(parsedDate);
    } else {
      onSelect(undefined);
    }
  };

  const handleInputBlur = () => {
    if (date) {
      setInputValue(format(date, "dd.MM.yyyy"));
    }
  };

  return (
    <DatePickerWrapper ref={containerRef}>
      <DateInputContainer>
        <DateInputIcon size={24} weight="regular" onClick={() => setIsOpen(!isOpen)} />
        <DateInput
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
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
          month={month}
          onMonthChange={setMonth}
          locale={locale}
          captionLayout="dropdown"
          startMonth={new Date(2025, 0)}
          endMonth={new Date(new Date().getFullYear() + 10, 11)}
          disabled={{ after: new Date() }}
        />
      </DatePickerPopover>
    </DatePickerWrapper>
  );
}
