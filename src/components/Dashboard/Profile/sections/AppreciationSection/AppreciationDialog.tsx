import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { ApiAppreciationGet, VolunteerStateAppreciationType } from "need4deed-sdk";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { de } from "date-fns/locale";
import { DialogButtonGroup, DialogForm } from "../shared/styles";
import { SelectableOption } from "../shared/SelectableOption";
import {
  DialogTitle,
  RadioOptionsContainer,
  ExpandedSection,
  SubQuestion,
  SubOptionContainer,
  DateFieldWrapper,
  Separator,
} from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: number;
    title: VolunteerStateAppreciationType;
    dateDue: Date | null;
    dateDelivery: Date | null;
  }) => void;
  initialData?: ApiAppreciationGet;
};

type DeliveryStatus = "received" | "pending";

const APPRECIATION_TYPES = [
  {
    value: VolunteerStateAppreciationType.TOTE_BAG,
    labelKey: "dashboard.appreciationSection.typeOptions.toteBag",
  },
  {
    value: VolunteerStateAppreciationType.T_SHIRT,
    labelKey: "dashboard.appreciationSection.typeOptions.tshirt",
  },
  {
    value: VolunteerStateAppreciationType.BENEFIT_CARD,
    labelKey: "dashboard.appreciationSection.typeOptions.benefitCard",
  },
];

export function AppreciationDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : undefined;

  const [selectedType, setSelectedType] = useState<
    VolunteerStateAppreciationType | undefined
  >(undefined);
  const [deliveryStatus, setDeliveryStatus] = useState<
    DeliveryStatus | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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

    onSave({
      id: initialData?.id,
      title: selectedType,
      dateDue: deliveryStatus === "pending" ? selectedDate : null,
      dateDelivery: deliveryStatus === "received" ? selectedDate : null,
    });
  };

  const isFormValid = !!selectedType && !!deliveryStatus && !!selectedDate;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DialogTitle data-testid="appreciation-dialog-title">
        {initialData
          ? t("dashboard.appreciationSection.editAppreciation")
          : t("dashboard.appreciationSection.addAppreciation")}
      </DialogTitle>

      <DialogForm onSubmit={handleSubmit} data-testid="appreciation-form">
        <RadioOptionsContainer data-testid="appreciation-options">
          {APPRECIATION_TYPES.map((option, index) => (
            <div key={option.value}>
              <SelectableOption
                isSelected={selectedType === option.value}
                label={t(option.labelKey)}
                onClick={() => handleTypeSelect(option.value)}
                data-testid={`type-option-${option.value}`}
              />

              {selectedType === option.value && (
                <ExpandedSection data-testid="expanded-section">
                  <SubQuestion>
                    {t("dashboard.appreciationSection.didVolunteerReceive")}
                  </SubQuestion>
                  <SubOptionContainer>
                    <SelectableOption
                      isSelected={deliveryStatus === "received"}
                      label={t(
                        "dashboard.appreciationSection.volunteerReceivedIt",
                      )}
                      onClick={() => handleDeliveryStatusSelect("received")}
                      data-testid="sub-option-received"
                    />

                    {deliveryStatus === "received" && (
                      <DateFieldWrapper data-testid="received-date-field">
                        <DatePickerWithLabel
                          date={selectedDate}
                          onSelect={setSelectedDate}
                          locale={locale}
                          label={t(
                            "dashboard.appreciationSection.receivedOnRequired",
                          )}
                          showTodayIndicator
                          todayText={t("dashboard.appreciationSection.today")}
                        />
                      </DateFieldWrapper>
                    )}

                    <SelectableOption
                      isSelected={deliveryStatus === "pending"}
                      label={t("dashboard.appreciationSection.needToGiveIt")}
                      onClick={() => handleDeliveryStatusSelect("pending")}
                      data-testid="sub-option-pending"
                    />

                    {deliveryStatus === "pending" && (
                      <DateFieldWrapper data-testid="due-date-field">
                        <DatePickerWithLabel
                          date={selectedDate}
                          onSelect={setSelectedDate}
                          locale={locale}
                          allowFuture
                          label={t(
                            "dashboard.appreciationSection.dueDateRequired",
                          )}
                          showTodayIndicator
                          todayText={t("dashboard.appreciationSection.today")}
                        />
                      </DateFieldWrapper>
                    )}
                  </SubOptionContainer>
                </ExpandedSection>
              )}

              {selectedType === option.value &&
                index < APPRECIATION_TYPES.length - 1 && <Separator />}
            </div>
          ))}
        </RadioOptionsContainer>

        <DialogButtonGroup>
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
            backgroundcolor={
              isFormValid ? "var(--color-aubergine)" : "var(--color-grey-50)"
            }
            textColor={
              isFormValid ? "var(--color-white)" : "var(--color-grey-400)"
            }
            disabled={!isFormValid}
          />
        </DialogButtonGroup>
      </DialogForm>
    </Modal>
  );
}
