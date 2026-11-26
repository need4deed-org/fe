import { EditableField } from "@/components/EditableField/EditableField";
import { ApiOrganizationContact } from "need4deed-sdk";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../../shared/styles";
import { OrganizationContactDetailsFormData } from "./organizationContactDetailsSchema";

const i18nPrefix = "dashboard.organizationProfile.contactDetails";

export function formatOrganizationContact(contact: ApiOrganizationContact): string {
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
  return [fullName, contact.email, contact.phone].filter(Boolean).join(" · ");
}

type Props = {
  contacts: ApiOrganizationContact[];
};

export const OrganizationContactDetailsDisplay = ({ contacts }: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<OrganizationContactDetailsFormData>();
  const values = watch();

  return (
    <FormDetails data-testid="organization-contact-details-display">
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <EditableField
            key={contact.personId}
            mode="display"
            type="text"
            label={t(`${i18nPrefix}.contactPerson`)}
            value={formatOrganizationContact(contact)}
            setValue={() => {}}
          />
        ))
      ) : (
        <EditableField
          mode="display"
          type="text"
          label={t(`${i18nPrefix}.contactPerson`)}
          value=""
          setValue={() => {}}
        />
      )}
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.email`)}
        value={values.email}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.phone`)}
        value={values.phone}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
