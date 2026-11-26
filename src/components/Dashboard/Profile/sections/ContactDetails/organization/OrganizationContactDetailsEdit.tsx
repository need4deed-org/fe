import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { ApiOrganizationContact } from "need4deed-sdk";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../../shared/styles";
import { formatOrganizationContact } from "./OrganizationContactDetailsDisplay";
import { OrganizationContactDetailsFormData } from "./organizationContactDetailsSchema";

const i18nPrefix = "dashboard.organizationProfile.contactDetails";

type Props = {
  contacts: ApiOrganizationContact[];
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
};

export const OrganizationContactDetailsEdit = ({ contacts, onCancel, onSubmit, isPending }: Props) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isValid, isDirty },
  } = useFormContext<OrganizationContactDetailsFormData>();

  return (
    <>
      <FormDetails data-testid="organization-contact-details-edit">
        {contacts.map((contact) => (
          <EditableField
            key={contact.personId}
            mode="display"
            type="text"
            label={t(`${i18nPrefix}.contactPerson`)}
            value={formatOrganizationContact(contact)}
            setValue={() => {}}
          />
        ))}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.email`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.phone`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.phone?.message}
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
          disabled={!isDirty || !isValid || isPending}
        />
      </FormButtonRow>
    </>
  );
};
