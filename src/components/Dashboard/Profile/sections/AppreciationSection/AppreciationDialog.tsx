"use client";
import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { CalendarBlank, CaretDown, Check } from "@phosphor-icons/react";
import { VolunteerStateAppreciationType } from "need4deed-sdk";
import { ApiAppreciationGet } from "./types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { DatePickerWithPopover } from "./DatePickerWithPopover";
import {
  ButtonGroup,
  DialogTitle,
  Form,
  RadioOptionsContainer,
  TypeOption,
  TypeOptionContent,
  CheckCircle,
  TypeLabel,
  ExpandedSection,
  SubQuestion,
  SubOptionContainer,
  SubOption,
  SubRadioCircle,
  SubOptionLabel,
  DateFieldWrapper,
  DateFieldLabel,
  DateFieldInput,
  DateFieldValue,
  Separator,
} from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ApiAppreciationGet>) => void;
  initialData?: ApiAppreciationGet;
};

type DeliveryStatus = "received" | "pending";

export function AppreciationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : undefined;

  const [selectedType, setSelectedType] = useState<VolunteerStateAppreciationType | undefined>(undefined);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const appreciationTypes = [
    { value: VolunteerStateAppreciationType.TOTE_BAG, labelKey: "dashboard.appreciationSection.typeOptions.toteBag" },
    { value: VolunteerStateAppreciationType.T_SHIRT, labelKey: "dashboard.appreciationSection.typeOptions.tshirt" },
    { value: VolunteerStateAppreciationType.BENEFIT_CARD, labelKey: "dashboard.appreciationSection.typeOptions.benefitCard" },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedType(initialData.title);
        if (initialData.dateDelivery) {
          setDeliveryStatus("received");
          setSelectedDate(new Date(initialData.dateDelivery));
        } else if (initialData.dateDue) {
          setDeliveryStatus("pending");
          setSelectedDate(new Date(initialData.dateDue));
        }
      } else {
        setSelectedType(undefined);
        setDeliveryStatus(undefined);
        setSelectedDate(undefined);
      }
    }
  }, [isOpen, initialData]);

  const handleTypeSelect = (type: VolunteerStateAppreciationType) => {
    setSelectedType(type);
    if (selectedType !== type) {
      setDeliveryStatus(undefined);
      setSelectedDate(undefined);
    }
  };

  const handleDeliveryStatusSelect = (status: DeliveryStatus) => {
    setDeliveryStatus(status);
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !deliveryStatus || !selectedDate) return;

    const payload: Partial<ApiAppreciationGet> = {
      id: initialData?.id,
      title: selectedType,
      dateDue: deliveryStatus === "pending" ? selectedDate : undefined,
      dateDelivery: deliveryStatus === "received" ? selectedDate : undefined,
    };
    onSave(payload);
  };

  const isFormValid = !!selectedType && !!deliveryStatus && !!selectedDate;

  const formatDateDisplay = (date: Date | undefined): string => {
    if (!date) return "";
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const formatted = format(date, "dd.MM.yyyy", { locale });
    return isToday ? `${formatted} (${t("dashboard.appreciationSection.today")})` : formatted;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DialogTitle data-testid="appreciation-dialog-title">
        {initialData
          ? t("dashboard.appreciationSection.editAppreciation")
          : t("dashboard.appreciationSection.addAppreciation")}
      </DialogTitle>

      <Form onSubmit={handleSubmit} data-testid="appreciation-form">
        <RadioOptionsContainer data-testid="appreciation-options">
          {appreciationTypes.map((option, index) => (
            <div key={option.value}>
              <TypeOption
                $isSelected={selectedType === option.value}
                onClick={() => handleTypeSelect(option.value)}
                data-testid={`type-option-${option.value}`}
              >
                <TypeOptionContent>
                  <CheckCircle $isSelected={selectedType === option.value}>
                    {selectedType === option.value && <Check size={14} weight="bold" color="var(--color-midnight)" />}
                  </CheckCircle>
                  <TypeLabel $isSelected={selectedType === option.value}>{t(option.labelKey)}</TypeLabel>
                </TypeOptionContent>
              </TypeOption>

              {selectedType === option.value && (
                <ExpandedSection data-testid="expanded-section">
                  <SubQuestion>{t("dashboard.appreciationSection.didVolunteerReceive")}</SubQuestion>
                  <SubOptionContainer>
                    <SubOption
                      $isSelected={deliveryStatus === "received"}
                      onClick={() => handleDeliveryStatusSelect("received")}
                      data-testid="sub-option-received"
                    >
                      <SubRadioCircle $isSelected={deliveryStatus === "received"}>
                        {deliveryStatus === "received" && <Check size={12} weight="bold" color="var(--color-midnight)" />}
                      </SubRadioCircle>
                      <SubOptionLabel $isSelected={deliveryStatus === "received"}>
                        {t("dashboard.appreciationSection.volunteerReceivedIt")}
                      </SubOptionLabel>
                    </SubOption>

                    {deliveryStatus === "received" && (
                      <DateFieldWrapper data-testid="received-date-field">
                        <DateFieldLabel>{t("dashboard.appreciationSection.receivedOnRequired")}</DateFieldLabel>
                        <DateFieldInput onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                          <CalendarBlank size={24} weight="regular" color="var(--color-midnight)" />
                          <DateFieldValue>{formatDateDisplay(selectedDate)}</DateFieldValue>
                          <CaretDown size={20} weight="regular" color="var(--color-midnight)" />
                        </DateFieldInput>
                        {isDatePickerOpen && (
                          <DatePickerWithPopover
                            date={selectedDate}
                            onSelect={(d) => {
                              setSelectedDate(d);
                              setIsDatePickerOpen(false);
                            }}
                            locale={locale}
                          />
                        )}
                      </DateFieldWrapper>
                    )}

                    <SubOption
                      $isSelected={deliveryStatus === "pending"}
                      onClick={() => handleDeliveryStatusSelect("pending")}
                      data-testid="sub-option-pending"
                    >
                      <SubRadioCircle $isSelected={deliveryStatus === "pending"}>
                        {deliveryStatus === "pending" && <Check size={12} weight="bold" color="var(--color-midnight)" />}
                      </SubRadioCircle>
                      <SubOptionLabel $isSelected={deliveryStatus === "pending"}>
                        {t("dashboard.appreciationSection.needToGiveIt")}
                      </SubOptionLabel>
                    </SubOption>

                    {deliveryStatus === "pending" && (
                      <DateFieldWrapper data-testid="due-date-field">
                        <DateFieldLabel>{t("dashboard.appreciationSection.dueDateRequired")}</DateFieldLabel>
                        <DateFieldInput onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                          <CalendarBlank size={24} weight="regular" color="var(--color-midnight)" />
                          <DateFieldValue>{formatDateDisplay(selectedDate)}</DateFieldValue>
                          <CaretDown size={20} weight="regular" color="var(--color-midnight)" />
                        </DateFieldInput>
                        {isDatePickerOpen && (
                          <DatePickerWithPopover
                            date={selectedDate}
                            onSelect={(d) => {
                              setSelectedDate(d);
                              setIsDatePickerOpen(false);
                            }}
                            locale={locale}
                            allowFuture
                          />
                        )}
                      </DateFieldWrapper>
                    )}
                  </SubOptionContainer>
                </ExpandedSection>
              )}

              {selectedType === option.value && index < appreciationTypes.length - 1 && <Separator />}
            </div>
          ))}
        </RadioOptionsContainer>

        <ButtonGroup>
          <Button
            text={t("dashboard.appreciationSection.cancel")}
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            backgroundcolor="transparent"
            textColor="var(--color-aubergine)"
            border="var(--border-width-medium) solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.appreciationSection.save")}
            onClick={handleSubmit}
            backgroundcolor={isFormValid ? "var(--color-aubergine)" : "var(--color-grey-50)"}
            textColor={isFormValid ? "var(--color-white)" : "var(--color-grey-400)"}
            disabled={!isFormValid}
          />
        </ButtonGroup>
      </Form>
    </Modal>
  );
}
