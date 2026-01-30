"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { useUpdateOpportunityContact } from "@/hooks/useUpdateOpportunityContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet, VolunteerCommunicationType } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ContactDetailsRef } from "../types";
import {
  createOpportunityContactDetailsSchema,
  OpportunityContactDetailsFormData,
} from "./opportunityContactDetailsSchema";

const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isEditing ? "var(--spacing-16)" : "0")};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-24);
  width: 100%;
`;

type Props = {
  opportunity: ApiOpportunityGet;
};

const waysToContactKeys = Object.values(VolunteerCommunicationType);

export const OpportunityContactDetails = forwardRef<ContactDetailsRef, Props>(function OpportunityContactDetails(
  { opportunity },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateContact, isPending } = useUpdateOpportunityContact(opportunity.id);
  const [isEditing, setIsEditing] = useState(false);

  const waysToContactOptions = waysToContactKeys.map((key) =>
    t(`dashboard.opportunityProfile.contactDetails.waysToContact.${key}`),
  );

  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  waysToContactKeys.forEach((key, index) => {
    const label = waysToContactOptions[index];
    keyToLabel[key] = label;
    labelToKey[label] = key;
  });

  const schema = createOpportunityContactDetailsSchema(t);

  const initialFormValues = useMemo((): OpportunityContactDetailsFormData => {
    // @ts-expect-error contact missing on SDK ApiOpportunityGet type
    const contact = opportunity.contact as {
      name?: string;
      phone?: string;
      email?: string;
      ways_to_contact?: VolunteerCommunicationType[];
    } | undefined;

    return {
      name: contact?.name || "",
      phone: contact?.phone || "",
      email: contact?.email || "",
      waysToContact: contact?.ways_to_contact || [],
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useImperativeHandle(ref, () => ({
    handleEditClick,
  }));

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
          ways_to_contact: values.waysToContact,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  useEffect(() => {
    if (!isEditing) {
      reset(initialFormValues);
    }
  }, [initialFormValues, isEditing, reset]);

  return (
    <Container data-testid="opportunity-contact-details-container" $isEditing={isEditing}>
      <Details>
        <Controller
          name="name"
          control={control}
          render={({ field }: { field: ControllerRenderProps<OpportunityContactDetailsFormData, "name"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
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
          render={({ field }: { field: ControllerRenderProps<OpportunityContactDetailsFormData, "phone"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
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
          render={({ field }: { field: ControllerRenderProps<OpportunityContactDetailsFormData, "email"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
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
          render={({
            field,
          }: {
            field: ControllerRenderProps<OpportunityContactDetailsFormData, "waysToContact">;
          }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="checkbox-list"
              label={t("dashboard.opportunityProfile.contactDetails.waysToContact.label")}
              value={field.value.map((key) => keyToLabel[key])}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                field.onChange(labels.map((label) => labelToKey[label]));
              }}
              options={waysToContactOptions}
              errorMessage={errors.waysToContact?.message}
            />
          )}
        />
      </Details>

      {isEditing && (
        <ButtonRow>
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
        </ButtonRow>
      )}
    </Container>
  );
});
