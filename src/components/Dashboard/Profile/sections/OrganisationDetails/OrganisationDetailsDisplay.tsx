import { EditableField } from "@/components/EditableField/EditableField";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";
import { OrganisationDetailsFormData } from "./organisationDetailsSchema";

const i18nPrefix = "dashboard.agentProfile.organisationDetails";

type Props = {
  values: OrganisationDetailsFormData;
  clientLanguagesDisplay: string;
};

export const OrganisationDetailsDisplay = ({ values, clientLanguagesDisplay }: Props) => {
  const { t } = useTranslation();

  return (
    <FormDetails data-testid="organisation-details-display">
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
        value={values.address}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.organisationType`)}
        value={values.organisationType}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.operator`)}
        value={values.operator}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.services`)}
        value={values.services}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.clientLanguages`)}
        value={clientLanguagesDisplay}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
