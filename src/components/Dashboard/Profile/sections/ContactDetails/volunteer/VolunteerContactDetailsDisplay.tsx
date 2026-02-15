import { EditableField } from "@/components/EditableField/EditableField";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../../shared/styles";
import { VolunteerContactDetailsFormData } from "./volunteerContactDetailsSchema";

type Props = {
  values: VolunteerContactDetailsFormData;
  communicationTypeLabels: string[];
};

export const VolunteerContactDetailsDisplay = ({ values, communicationTypeLabels }: Props) => {
  const { t } = useTranslation();

  return (
    <FormDetails data-testid="volunteer-contact-details-display">
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.volunteerProfile.contactDetails.phone")}
        value={values.phone}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.volunteerProfile.contactDetails.email")}
        value={values.email}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.volunteerProfile.contactDetails.address")}
        value={values.address}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="checkbox-list"
        label={t("dashboard.volunteerProfile.contactDetails.preferredCommunicationType.label")}
        value={communicationTypeLabels}
        setValue={() => {}}
        options={[]}
      />
    </FormDetails>
  );
};
