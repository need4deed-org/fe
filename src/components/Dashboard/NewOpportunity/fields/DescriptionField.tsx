import { opportunityFieldStackingThreshold } from "@/config/constants";
import { useFormContext, Controller } from "react-hook-form";
import { OpportunityDetailsFormData } from "../../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { EditableField } from "@/components/EditableField/EditableField";
import { SOURCE_TEXT_LIMITS } from "@/utils/opportunity-text-limits";
import { useTranslation } from "react-i18next";

export default function DescriptionField({ prefix }: { prefix: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<OpportunityDetailsFormData>();
  const { t } = useTranslation();

  return (
    <Controller
      name="description"
      control={control}
      render={({ field }) => (
        <EditableField
          stackAt={opportunityFieldStackingThreshold}
          mode="edit"
          type="textarea"
          label={t(`${prefix}.description`)}
          value={field.value}
          setValue={field.onChange}
          hint={t(`${prefix}.maxCharsHint`, { max: SOURCE_TEXT_LIMITS.description.max })}
          errorMessage={errors.description?.message}
        />
      )}
    />
  );
}
