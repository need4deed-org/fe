"use client";
import Button from "@/components/core/button/Button/Button";
import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { EditableField } from "@/components/EditableField/EditableField";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormContainer, FormDetails } from "../shared/styles";
import { EditableSectionRef } from "../shared/types";
import { OrganisationDetailsFormData, organisationDetailsSchema } from "./organisationDetailsSchema";

const i18nPrefix = "dashboard.agentProfile.organisationDetails";

type Props = {
  agent: ApiAgentProfileGet;
};

export const OrganisationDetails = forwardRef<EditableSectionRef, Props>(function OrganisationDetails({ agent }, ref) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const details = agent.organisationDetails;
  const initialFormValues: OrganisationDetailsFormData = {
    about: details?.about ?? "",
    website: details?.website ?? "",
    address: details?.address ?? "",
    organisationType: details?.organisationType ?? "",
    operator: details?.operator ?? "",
    services: details?.services ?? "",
    clientLanguages: details?.clientLanguages ?? "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<OrganisationDetailsFormData>({
    resolver: zodResolver(organisationDetailsSchema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  const handleEditClick = () => setIsEditing(true);

  useImperativeHandle(ref, () => ({ handleEditClick }));

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = () => {
    setIsEditing(false);
  };

  const mode = isEditing ? "edit" : "display";

  return (
    <FormContainer data-testid="organisation-details-container" $isEditing={isEditing}>
      <FormDetails>
        <Controller
          name="about"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t(`${i18nPrefix}.about`)}
              value={field.value}
              setValue={field.onChange}
            />
          )}
        />
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t(`${i18nPrefix}.website`)}
              value={field.value}
              setValue={field.onChange}
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
              label={t(`${i18nPrefix}.address`)}
              value={field.value}
              setValue={field.onChange}
            />
          )}
        />
        <Controller
          name="organisationType"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t(`${i18nPrefix}.organisationType`)}
              value={field.value}
              setValue={field.onChange}
            />
          )}
        />
        <Controller
          name="operator"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t(`${i18nPrefix}.operator`)}
              value={field.value}
              setValue={field.onChange}
            />
          )}
        />
        <Controller
          name="services"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t(`${i18nPrefix}.services`)}
              value={field.value}
              setValue={field.onChange}
            />
          )}
        />
        <Controller
          name="clientLanguages"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t(`${i18nPrefix}.clientLanguages`)}
              value={field.value}
              setValue={field.onChange}
            />
          )}
        />
      </FormDetails>

      {isEditing && (
        <FormButtonRow>
          <Button
            text={t(`${i18nPrefix}.cancel`)}
            onClick={handleCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t(`${i18nPrefix}.saveChanges`)}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            disabled={!isDirty || !isValid}
          />
        </FormButtonRow>
      )}
    </FormContainer>
  );
});
