"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { useUpdateOpportunityAgent } from "@/hooks/useUpdateOpportunityAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet, Lang } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormContainer, FormDetails } from "../shared/styles";
import { EditableSectionRef } from "../shared/types";
import {
  createRefugeeAccommodationCentreSchema,
  RefugeeAccommodationCentreFormData,
} from "./refugeeAccommodationCentreSchema";

type Props = {
  opportunity: ApiOpportunityGet;
};

export const RefugeeAccommodationCentre = forwardRef<EditableSectionRef, Props>(function RefugeeAccommodationCentre(
  { opportunity },
  ref,
) {
  const { t, i18n } = useTranslation();
  const { mutate: updateAgent, isPending } = useUpdateOpportunityAgent(opportunity.id);
  const [isEditing, setIsEditing] = useState(false);

  const schema = createRefugeeAccommodationCentreSchema(t);

  const initialFormValues = useMemo((): RefugeeAccommodationCentreFormData => {
    const { agent } = opportunity;
    const lang = i18n.language as Lang;
    const districtTitle = agent.district?.title?.[lang] ?? agent.district?.title?.en ?? "";

    return {
      name: agent.name ?? "",
      address: agent.address ?? "",
      district: districtTitle,
    };
  }, [opportunity, i18n.language]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<RefugeeAccommodationCentreFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  const handleEditClick = () => setIsEditing(true);

  useImperativeHandle(ref, () => ({ handleEditClick }));

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (values: RefugeeAccommodationCentreFormData) => {
    updateAgent(
      {
        agent: {
          name: values.name,
          address: values.address,
          // TODO: district should be an ID - needs dropdown selector
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  useEffect(() => {
    if (isEditing) return;
    reset(initialFormValues);
  }, [initialFormValues, isEditing, reset]);

  const mode = isEditing ? "edit" : "display";

  return (
    <FormContainer data-testid="refugee-accommodation-centre-container" $isEditing={isEditing}>
      <FormDetails>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t("dashboard.opportunityProfile.rac.name")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t("dashboard.opportunityProfile.rac.address")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.address?.message}
            />
          )}
        />

        <Controller
          name="district"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t("dashboard.opportunityProfile.rac.district")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.district?.message}
            />
          )}
        />
      </FormDetails>

      {isEditing && (
        <FormButtonRow>
          <Button
            text={t("dashboard.opportunityProfile.rac.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t("dashboard.opportunityProfile.rac.saveChanges")}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            disabled={!isDirty || !isValid || isPending}
          />
        </FormButtonRow>
      )}
    </FormContainer>
  );
});
