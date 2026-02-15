import { EditableField } from "@/components/EditableField/EditableField";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";
import { RefugeeAccommodationCentreFormData } from "./refugeeAccommodationCentreSchema";

type Props = {
  values: RefugeeAccommodationCentreFormData;
};

export const RefugeeAccommodationCentreDisplay = ({ values }: Props) => {
  const { t } = useTranslation();

  return (
    <FormDetails data-testid="refugee-accommodation-centre-display">
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.rac.name")}
        value={values.name}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.rac.address")}
        value={values.address}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.rac.district")}
        value={values.district}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
