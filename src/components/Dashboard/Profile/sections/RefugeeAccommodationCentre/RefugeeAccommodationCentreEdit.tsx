import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../shared/styles";
import { RefugeeAccommodationCentreFormData } from "./refugeeAccommodationCentreSchema";

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
};

export const RefugeeAccommodationCentreEdit = ({ onCancel, onSubmit, isPending }: Props) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isValid, isDirty },
  } = useFormContext<RefugeeAccommodationCentreFormData>();

  return (
    <>
      <FormDetails data-testid="refugee-accommodation-centre-edit">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.rac.name")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.name?.message}
            />
          )}
        />
      </FormDetails>

      <FormButtonRow>
        <Button
          text={t("dashboard.opportunityProfile.rac.cancel")}
          onClick={onCancel}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t("dashboard.opportunityProfile.rac.saveChanges")}
          onClick={onSubmit}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          disabled={!isDirty || !isValid || isPending}
        />
      </FormButtonRow>
    </>
  );
};
