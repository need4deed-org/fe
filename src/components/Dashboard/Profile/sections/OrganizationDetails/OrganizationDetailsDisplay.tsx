import { EditableField } from "@/components/EditableField/EditableField";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";
import { OrganizationDetailsFormData } from "./organizationDetailsSchema";

const i18nPrefix = "dashboard.organizationProfile.organisationDetails";

type Props = {
  address: string;
  services: string[];
};

export const OrganizationDetailsDisplay = ({ address, services }: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<OrganizationDetailsFormData>();
  const values = watch();

  return (
    <FormDetails data-testid="organisation-details-display">
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.orgTitle`)}
        value={values.title}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.about`)}
        value={values.about}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.website`)}
        value={values.website}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.address`)}
        value={address}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="checkbox-list"
        label={t(`${i18nPrefix}.services`)}
        value={services}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
