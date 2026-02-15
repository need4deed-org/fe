import { EditableField } from "@/components/EditableField/EditableField";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../../shared/styles";
import { OpportunityContactDetailsFormData } from "./opportunityContactDetailsSchema";

type Props = {
  values: OpportunityContactDetailsFormData;
  waysToContactLabels: string[];
};

export const OpportunityContactDetailsDisplay = ({ values, waysToContactLabels }: Props) => {
  const { t } = useTranslation();

  return (
    <FormDetails data-testid="opportunity-contact-details-display">
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.contactDetails.name")}
        value={values.name}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.contactDetails.phone")}
        value={values.phone}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.contactDetails.email")}
        value={values.email}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="checkbox-list"
        label={t("dashboard.opportunityProfile.contactDetails.waysToContact.label")}
        value={waysToContactLabels}
        setValue={() => {}}
        options={[]}
      />
    </FormDetails>
  );
};
