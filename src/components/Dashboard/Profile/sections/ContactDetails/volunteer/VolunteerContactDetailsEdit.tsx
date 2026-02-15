import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../../shared/styles";
import { VolunteerContactDetailsFormData } from "./volunteerContactDetailsSchema";

type Props = {
  options: string[];
  keysToLabels: (keys: string[]) => string[];
  labelsToKeys: (labels: (string | number)[]) => string[];
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
};

export const VolunteerContactDetailsEdit = ({
  options,
  keysToLabels,
  labelsToKeys,
  onCancel,
  onSubmit,
  isPending,
}: Props) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isValid, isDirty },
  } = useFormContext<VolunteerContactDetailsFormData>();

  return (
    <>
      <FormDetails data-testid="volunteer-contact-details-edit">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.phone")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.email")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.address")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.address?.message}
            />
          )}
        />

        <Controller
          name="preferredCommunicationType"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="checkbox-list"
              label={t("dashboard.volunteerProfile.contactDetails.preferredCommunicationType.label")}
              value={keysToLabels(field.value)}
              setValue={(value) => field.onChange(labelsToKeys(Array.isArray(value) ? value : [value]))}
              options={options}
              errorMessage={errors.preferredCommunicationType?.message}
            />
          )}
        />
      </FormDetails>

      <FormButtonRow>
        <Button
          text={t("dashboard.volunteerProfile.contactDetails.cancel")}
          onClick={onCancel}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t("dashboard.volunteerProfile.contactDetails.saveChanges")}
          onClick={onSubmit}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          disabled={!isDirty || !isValid || isPending}
        />
      </FormButtonRow>
    </>
  );
};
