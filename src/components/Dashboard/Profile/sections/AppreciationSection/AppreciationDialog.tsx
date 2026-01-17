"use client";
import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { TShirt, Tote, IdentificationCard } from "@phosphor-icons/react";
import { VolunteerStateAppreciationType } from "need4deed-sdk";
import { ApiAppreciationGet } from "./types";
import { JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ButtonGroup,
  DialogTitle,
  Form,
  RadioOption,
  RadioInput,
  RadioLabel,
  RadioOptionsContainer,
} from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ApiAppreciationGet>) => void;
  initialData?: ApiAppreciationGet;
};

type AppreciationOption = {
  value: VolunteerStateAppreciationType;
  labelKey: string;
  icon: JSX.Element;
};

export function AppreciationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t } = useTranslation();

  const [selectedType, setSelectedType] = useState<VolunteerStateAppreciationType | undefined>(undefined);

  const appreciationOptions: AppreciationOption[] = [
    {
      value: VolunteerStateAppreciationType.TOTE_BAG,
      labelKey: "dashboard.appreciationSection.typeOptions.toteBag",
      icon: <Tote size={20} weight="regular" color="var(--color-coral)" />,
    },
    {
      value: VolunteerStateAppreciationType.T_SHIRT,
      labelKey: "dashboard.appreciationSection.typeOptions.tshirt",
      icon: <TShirt size={20} weight="regular" color="var(--color-coral)" />,
    },
    {
      value: VolunteerStateAppreciationType.BENEFIT_CARD,
      labelKey: "dashboard.appreciationSection.typeOptions.benefitCard",
      icon: <IdentificationCard size={20} weight="regular" color="var(--color-coral)" />,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedType(initialData.title);
      } else {
        setSelectedType(undefined);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    const payload: Partial<ApiAppreciationGet> = {
      id: initialData?.id,
      title: selectedType,
    };
    onSave(payload);
  };

  const isFormValid = !!selectedType;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DialogTitle data-testid="appreciation-dialog-title">
        {initialData
          ? t("dashboard.appreciationSection.editAppreciation")
          : t("dashboard.appreciationSection.addAppreciation")}
      </DialogTitle>

      <Form onSubmit={handleSubmit} data-testid="appreciation-form">
        <RadioOptionsContainer data-testid="appreciation-options">
          {appreciationOptions.map((option) => (
            <RadioOption
              key={option.value}
              $isSelected={selectedType === option.value}
              onClick={() => setSelectedType(option.value)}
              data-testid={`radio-option-${option.value}`}
            >
              <RadioInput
                type="radio"
                name="appreciationType"
                value={option.value}
                checked={selectedType === option.value}
                onChange={() => setSelectedType(option.value)}
                data-testid={`radio-input-${option.value}`}
              />
              {option.icon}
              <RadioLabel>{t(option.labelKey)}</RadioLabel>
            </RadioOption>
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
