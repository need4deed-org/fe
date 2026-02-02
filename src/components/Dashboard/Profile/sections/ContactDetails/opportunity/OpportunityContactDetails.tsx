"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { useUpdateOpportunityContact } from "@/hooks/useUpdateOpportunityContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet, PrefferedCommunicationType } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormContainer, FormDetails } from "../../shared/styles";
import { useEnumTranslation } from "../shared";
import { ContactDetailsRef } from "../types";
import {
  createOpportunityContactDetailsSchema,
  OpportunityContactDetailsFormData,
} from "./opportunityContactDetailsSchema";

type Props = {
  opportunity: ApiOpportunityGet;
};

const COMMUNICATION_TYPES = Object.values(PrefferedCommunicationType);

export const OpportunityContactDetails = forwardRef<ContactDetailsRef, Props>(function OpportunityContactDetails(
  { opportunity },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateContact, isPending } = useUpdateOpportunityContact(opportunity.id);
  const [isEditing, setIsEditing] = useState(false);

  const { options, keysToLabels, labelsToKeys } = useEnumTranslation(
    COMMUNICATION_TYPES,
    "dashboard.opportunityProfile.contactDetails.waysToContact",
  );

  const schema = createOpportunityContactDetailsSchema(t);

  const initialFormValues = useMemo((): OpportunityContactDetailsFormData => {
    const contact = opportunity.contact;

    return {
      name: contact?.name ?? "",
      phone: contact?.phone ?? "",
      email: contact?.email ?? "",
      waysToContact: contact?.waysToContact ?? [],
    };
  }, [opportunity]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<OpportunityContactDetailsFormData>({
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

  const onSubmit = (values: OpportunityContactDetailsFormData) => {
    updateContact(
      {
        contact: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          waysToContact: values.waysToContact,
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  useEffect(() => {
    if (!isEditing) {
      reset(initialFormValues);
    }
  }, [initialFormValues, isEditing, reset]);

  const mode = isEditing ? "edit" : "display";

  return (
    <FormContainer data-testid="opportunity-contact-details-container" $isEditing={isEditing}>
      <FormDetails>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t("dashboard.opportunityProfile.contactDetails.name")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t("dashboard.opportunityProfile.contactDetails.phone")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="text"
              label={t("dashboard.opportunityProfile.contactDetails.email")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          name="waysToContact"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="checkbox-list"
              label={t("dashboard.opportunityProfile.contactDetails.waysToContact.label")}
              value={keysToLabels(field.value)}
              setValue={(value) => field.onChange(labelsToKeys(Array.isArray(value) ? value : [value]))}
              options={options}
              errorMessage={errors.waysToContact?.message}
            />
          )}
        />
      </FormDetails>

      {isEditing && (
        <FormButtonRow>
          <Button
            text={t("dashboard.opportunityProfile.contactDetails.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t("dashboard.opportunityProfile.contactDetails.saveChanges")}
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
