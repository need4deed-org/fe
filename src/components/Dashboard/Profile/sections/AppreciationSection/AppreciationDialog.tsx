"use client";
import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { X } from "@phosphor-icons/react";
import { de } from "date-fns/locale";
import { VolunteerStateAppreciationType } from "need4deed-sdk";
import { ApiAppreciationGet } from "./types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatePickerWithPopover } from "./DatePickerWithPopover";
import {
  ButtonGroup,
  CloseButton,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  Label,
  Select,
} from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ApiAppreciationGet>) => void;
  initialData?: ApiAppreciationGet;
};

type FormData = {
  title: VolunteerStateAppreciationType;
  dateDue: Date | undefined;
  dateDelivery: Date | undefined;
};

export function AppreciationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : undefined;

  const [formData, setFormData] = useState<FormData>({
    title: VolunteerStateAppreciationType.T_SHIRT,
    dateDue: undefined,
    dateDelivery: undefined,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          dateDue: initialData.dateDue ? new Date(initialData.dateDue) : undefined,
          dateDelivery: initialData.dateDelivery ? new Date(initialData.dateDelivery) : undefined,
        });
      } else {
        setFormData({
          title: VolunteerStateAppreciationType.T_SHIRT,
          dateDue: undefined,
          dateDelivery: undefined,
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dateDue) return;

    const payload: Partial<ApiAppreciationGet> = {
      id: initialData?.id,
      title: formData.title,
      dateDue: formData.dateDue,
      dateDelivery: formData.dateDelivery,
    };
    onSave(payload);
  };

  const isFormValid = formData.title && formData.dateDue;

  const appreciationTypeOptions = [
    { value: VolunteerStateAppreciationType.T_SHIRT, label: t("dashboard.appreciationSection.typeOptions.tshirt") },
    { value: VolunteerStateAppreciationType.TOTE_BAG, label: t("dashboard.appreciationSection.typeOptions.toteBag") },
    { value: VolunteerStateAppreciationType.BENEFIT_CARD, label: t("dashboard.appreciationSection.typeOptions.benefitCard") },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>
          {initialData
            ? t("dashboard.appreciationSection.editAppreciation")
            : t("dashboard.appreciationSection.addAppreciation")}
        </DialogTitle>
        <CloseButton onClick={onClose} data-testid="close-dialog-button">
          <X size={24} weight="bold" />
        </CloseButton>
      </DialogHeader>

      <Form onSubmit={handleSubmit} data-testid="appreciation-form">
        <FormField>
          <Label>{t("dashboard.appreciationSection.typeOfAppreciationRequired")}</Label>
          <Select
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value as VolunteerStateAppreciationType })}
            data-testid="appreciation-type-select"
          >
            {appreciationTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField>
          <Label>{t("dashboard.appreciationSection.dueDateRequired")}</Label>
          <DatePickerWithPopover
            date={formData.dateDue}
            onSelect={(d) => setFormData({ ...formData, dateDue: d })}
            locale={locale}
            allowFuture
          />
        </FormField>

        <FormField>
          <Label>{t("dashboard.appreciationSection.deliveryDate")}</Label>
          <DatePickerWithPopover
            date={formData.dateDelivery}
            onSelect={(d) => setFormData({ ...formData, dateDelivery: d })}
            locale={locale}
          />
        </FormField>

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
            backgroundcolor="var(--color-aubergine)"
            textColor="var(--color-white)"
            disabled={!isFormValid}
          />
        </ButtonGroup>
      </Form>
    </Modal>
  );
}
