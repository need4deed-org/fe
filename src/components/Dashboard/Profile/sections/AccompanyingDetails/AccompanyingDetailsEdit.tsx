import Button from "@/components/core/button/Button/Button";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { EditableField } from "@/components/EditableField/EditableField";
import { Locale } from "date-fns";
import { Control, Controller, ControllerRenderProps, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AccompanyingDetailsFormData } from "./accompanyingDetailsSchema";
import {
  ButtonRow,
  DateFieldRow,
  DatePickerContainer,
  Details,
  ErrorText,
  TimeInput,
  TimeInputWrapper,
} from "./styles";

type Props = {
  control: Control<AccompanyingDetailsFormData>;
  errors: FieldErrors<AccompanyingDetailsFormData>;
  locale: Locale;
  languageOptions: string[];
  keyToLabel: Record<string, string>;
  labelToKey: Record<string, string>;
  onCancel: () => void;
  onSubmit: () => void;
  isDirty: boolean;
  isValid: boolean;
  isPending: boolean;
};

export const AccompanyingDetailsEdit = ({
  control,
  errors,
  locale,
  languageOptions,
  keyToLabel,
  labelToKey,
  onCancel,
  onSubmit,
  isDirty,
  isValid,
  isPending,
}: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Details data-testid="accompanying-details-edit">
        <Controller
          name="appointmentAddress"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentAddress"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.accompanyingDetails.appointmentAddress")}
              value={field.value || ""}
              setValue={field.onChange}
              errorMessage={errors.appointmentAddress?.message}
            />
          )}
        />

        <Controller
          name="appointmentDate"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentDate"> }) => (
            <DateFieldRow data-testid="appointment-date-field">
              <label>{t("dashboard.opportunityProfile.accompanyingDetails.appointmentDate")}</label>
              <DatePickerContainer>
                <DatePickerWithLabel
                  date={field.value ?? undefined}
                  onSelect={(d) => field.onChange(d ?? null)}
                  locale={locale}
                  allowFuture
                />
              </DatePickerContainer>
            </DateFieldRow>
          )}
        />

        <Controller
          name="appointmentTime"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentTime"> }) => (
            <DateFieldRow data-testid="appointment-time-field">
              <label>{t("dashboard.opportunityProfile.accompanyingDetails.appointmentTime")}</label>
              <TimeInputWrapper>
                <TimeInput
                  type="text"
                  placeholder="HH:MM"
                  value={field.value || ""}
                  onChange={field.onChange}
                  $hasError={!!errors.appointmentTime}
                />
                {errors.appointmentTime && (
                  <ErrorText>
                    {t(
                      `dashboard.opportunityProfile.accompanyingDetails.validation.${errors.appointmentTime.message}`,
                    )}
                  </ErrorText>
                )}
              </TimeInputWrapper>
            </DateFieldRow>
          )}
        />

        <Controller
          name="refugeeNumber"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "refugeeNumber"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeNumber")}
              value={field.value || ""}
              setValue={field.onChange}
              errorMessage={errors.refugeeNumber?.message}
            />
          )}
        />

        <Controller
          name="refugeeName"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "refugeeName"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeName")}
              value={field.value || ""}
              setValue={field.onChange}
              errorMessage={errors.refugeeName?.message}
            />
          )}
        />

        <Controller
          name="languageToTranslate"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "languageToTranslate"> }) => (
            <EditableField
              mode="edit"
              type="radio-list"
              label={t("dashboard.opportunityProfile.accompanyingDetails.languageToTranslate")}
              value={keyToLabel[field.value || ""] || field.value || ""}
              setValue={(value) => {
                const label = Array.isArray(value) ? value[0] : value;
                field.onChange(labelToKey[label] || label);
              }}
              options={languageOptions}
              errorMessage={errors.languageToTranslate?.message}
            />
          )}
        />
      </Details>

      <ButtonRow>
        <Button
          text={t("dashboard.opportunityProfile.accompanyingDetails.cancel")}
          onClick={onCancel}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t("dashboard.opportunityProfile.accompanyingDetails.saveChanges")}
          onClick={onSubmit}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          disabled={!isDirty || !isValid || isPending}
        />
      </ButtonRow>
    </>
  );
};
