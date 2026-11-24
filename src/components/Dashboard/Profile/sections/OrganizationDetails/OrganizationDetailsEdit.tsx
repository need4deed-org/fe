import Button from "@/components/core/button/Button/Button";
import { PLZChip } from "@/components/core/common";
import { EditableField } from "@/components/EditableField/EditableField";
import { usePLZField } from "@/hooks/use-plz-field";
import { ORGANIZATION_ABOUT_MAX_LENGTH } from "need4deed-sdk";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../shared/styles";
import { OrganizationDetailsFormData } from "./organizationDetailsSchema";

const i18nPrefix = "dashboard.organizationProfile.organisationDetails";

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
};

export const OrganizationDetailsEdit = ({ onCancel, onSubmit, isPending }: Props) => {
  const { t } = useTranslation();
  const {
    control,
    trigger,
    formState: { errors, isDirty, isValid },
  } = useFormContext<OrganizationDetailsFormData>();
  const plz = usePLZField(control, "addressPostcode");

  return (
    <>
      <FormDetails data-testid="organisation-details-edit">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.orgTitle`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.title?.message}
            />
          )}
        />
        <Controller
          name="about"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="textarea"
              label={t(`${i18nPrefix}.about`)}
              value={field.value}
              setValue={field.onChange}
              maxLength={ORGANIZATION_ABOUT_MAX_LENGTH}
              errorMessage={errors.about?.message}
            />
          )}
        />
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.website`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.website?.message}
            />
          )}
        />
        <Controller
          name="addressStreet"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.addressStreet`)}
              value={field.value}
              setValue={(value) => {
                field.onChange(value);
                void trigger("addressPostcode");
              }}
              errorMessage={errors.addressStreet?.message}
            />
          )}
        />
        <Controller
          name="addressPostcode"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.addressPostcode`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.addressPostcode?.message}
              supportingContent={<PLZChip status={plz.status} />}
            />
          )}
        />
      </FormDetails>

      <FormButtonRow>
        <Button
          text={t(`${i18nPrefix}.cancel`)}
          onClick={onCancel}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t(`${i18nPrefix}.saveChanges`)}
          onClick={onSubmit}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          disabled={!isDirty || !isValid || isPending || plz.blocksSubmit}
        />
      </FormButtonRow>
    </>
  );
};
