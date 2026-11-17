import Checkbox from "@/components/core/button/Checkbox/Checkbox";
import { PLZChip } from "@/components/core/common";
import { EditableField } from "@/components/EditableField/EditableField";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";
import { OpportunityAddressFormData } from "./opportunityAddressSchema";
import { PLZCheckStatus } from "@/utils/plz-check";

const i18nPrefix = "dashboard.opportunityProfile.opportunityAddress";
const textFields = ["street", "postcode", "city"] as const;

type Props = {
  plzStatus: PLZCheckStatus;
};

export function OpportunityAddressFields({ plzStatus }: Props) {
  const { t } = useTranslation();
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<OpportunityAddressFormData>();
  const notMyLocation = watch("notMyLocation");

  return (
    <FormDetails>
      <Controller
        name="notMyLocation"
        control={control}
        render={({ field }) => (
          <Checkbox
            width="24px"
            height="24px"
            label={t(`${i18nPrefix}.notMyLocation`)}
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {notMyLocation &&
        textFields.map((name) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <EditableField
                mode="edit"
                type="text"
                label={t(`${i18nPrefix}.${name}`)}
                value={field.value}
                setValue={field.onChange}
                errorMessage={errors[name]?.message}
                supportingContent={name === "postcode" ? <PLZChip status={plzStatus} /> : undefined}
              />
            )}
          />
        ))}
    </FormDetails>
  );
}
