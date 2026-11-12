import Button from "@/components/core/button/Button/Button";
import { PLZChip } from "@/components/core/common";
import { EditableField } from "@/components/EditableField/EditableField";
import { useCheckPLZ } from "@/hooks/use-check-plz";
import { VolunteerCommunicationType } from "need4deed-sdk";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../../shared/styles";
import { VolunteerContactDetailsFormData } from "./volunteerContactDetailsSchema";

type Props = {
  options: string[];
  keysToLabels: (keys: VolunteerCommunicationType[]) => string[];
  labelsToKeys: (labels: (string | number)[]) => VolunteerCommunicationType[];
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
  const postcode = useWatch({ control, name: "postcode" });
  const plz = useCheckPLZ(postcode ?? "");

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
          name="street"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.street")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.street?.message}
            />
          )}
        />
        <Controller
          name="postcode"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.postcode")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.postcode?.message}
              supportingContent={<PLZChip status={plz.status} />}
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
          disabled={!isDirty || !isValid || isPending || plz.blocksSubmit}
        />
      </FormButtonRow>
    </>
  );
};
