"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { createAgentContactDetailsSchema, AgentContactDetailsFormData } from "./agentContactDetailsSchema";
import Divider from "../../../common/Divider";
import { useUpdateAgentContact } from "@/hooks/useUpdateAgentContact";
import { AgentRoles } from "@/config/constants";
import { ApiAgentProfileGet } from "../../../types";

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

const FieldWrapper = styled.div<{ $hasError?: boolean }>`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: ${(props) =>
    props.$hasError ? "var(--editableField-fieldWrapper-padding-error)" : "var(--editableField-fieldWrapper-padding)"};
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
  }

  > span {
    flex: 1;
  }

  input {
    border-radius: var(--editableField-fieldWrapper-input-borderRadius);
    padding: var(--editableField-fieldWrapper-input-padding);
    color: var(--color-midnight);
    border: var(--editableField-fieldWrapper-input-border);
    flex: 1;
    min-width: 0;
  }
`;

type Props = {
  agent: ApiAgentProfileGet;
};

export type ContactDetailsRef = {
  handleEditClick: () => void;
};

const roleKeys = Object.values(AgentRoles);

export const AgentContactDetails = forwardRef<ContactDetailsRef, Props>(function ContactDetails({ agent }, ref) {
  const { t } = useTranslation();
  const { mutate: updateAgent, isPending } = useUpdateAgentContact(String(agent?.id));
  const [isEditing, setIsEditing] = useState(false);

  const roleOptions = roleKeys.map((key) => t(`dashboard.agentProfile.contactDetails.roles.${key}`));

  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  roleKeys.forEach((key, index) => {
    const label = roleOptions[index];
    keyToLabel[key] = label;
    labelToKey[label] = key;
  });

  const schema = createAgentContactDetailsSchema(t);

  const initialFormValues = useMemo((): AgentContactDetailsFormData => {
    return {
      firstName: agent?.contactDetails?.firstName || "",
      middleName: agent?.contactDetails?.middleName || "",
      lastName: agent?.contactDetails?.lastName || "",
      role: agent?.contactDetails?.role || [],
      email: agent?.contactDetails?.email || "",
      phone: agent?.contactDetails?.phone || "",
      landline: agent?.contactDetails?.landline || "",
    };
  }, [agent]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AgentContactDetailsFormData>({
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

  const onSubmit = (values: AgentContactDetailsFormData) => {
    updateAgent(
      {
        contactDetails: {
          firstName: values.firstName,
          lastName: values.lastName,
          middleName: values.middleName,
          role: values?.role?.length ? (values.role as AgentRoles[]) : undefined,
          email: values.email,
          phone: values.phone,
          landline: values.landline,
        },
      },
      {
        onSuccess: () => {
          handleCancel();
        },
      },
    );
  };

  // Reset form when person data changes (after successful mutation & refetch)
  useEffect(() => {
    if (!isEditing) {
      reset(initialFormValues);
    }
  }, [initialFormValues, isEditing, reset]);
  return (
    <Container $isEditing={isEditing}>
      <Details>
        {isEditing ? (
          <>
            <Controller
              name="firstName"
              control={control}
              render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "firstName"> }) => (
                <EditableField
                  mode="edit"
                  type="text"
                  label={t("dashboard.agentProfile.contactDetails.firstName")}
                  value={field.value}
                  setValue={field.onChange}
                  errorMessage={errors.firstName?.message}
                />
              )}
            />
            <Divider />
            <Controller
              name="middleName"
              control={control}
              render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "middleName"> }) => (
                <EditableField
                  mode="edit"
                  type="text"
                  label={t("dashboard.agentProfile.contactDetails.middleName")}
                  value={field.value ? field.value : ""}
                  setValue={field.onChange}
                  errorMessage={errors.middleName?.message}
                />
              )}
            />
            <Divider />
            <Controller
              name="lastName"
              control={control}
              render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "lastName"> }) => (
                <EditableField
                  mode="edit"
                  type="text"
                  label={t("dashboard.agentProfile.contactDetails.lastName")}
                  value={field.value}
                  setValue={field.onChange}
                  errorMessage={errors.lastName?.message}
                />
              )}
            />
          </>
        ) : (
          <FieldWrapper>
            <>
              <label>{t("dashboard.agentProfile.contactDetails.fullName")}</label>
              <span>
                {agent?.contactDetails?.firstName
                  ? `${agent?.contactDetails?.firstName} ${agent?.contactDetails?.middleName || ""} ${agent?.contactDetails?.lastName}`
                  : "–"}
              </span>
            </>
          </FieldWrapper>
        )}
        <Divider />
        <Controller
          name="role"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "role"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="checkbox-list"
              label={t("dashboard.agentProfile.contactDetails.roles.label")}
              value={field.value ? field?.value?.map((key) => keyToLabel[key]) : []}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                field.onChange(labels.map((label) => labelToKey[label as AgentRoles]));
              }}
              options={roleOptions}
              errorMessage={errors.role?.message}
            />
          )}
        />
        <Divider />
        <Controller
          name="email"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "email"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.agentProfile.contactDetails.email")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Divider />
        <Controller
          name="phone"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "phone"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.agentProfile.contactDetails.mobile")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.phone?.message}
            />
          )}
        />
        <Divider />
        <Controller
          name="landline"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "landline"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.agentProfile.contactDetails.landline")}
              value={field.value ? field.value : ""}
              setValue={field.onChange}
              errorMessage={errors.landline?.message}
            />
          )}
        />
      </Details>

      {isEditing && (
        <ButtonRow>
          <Button
            text={t("dashboard.agentProfile.contactDetails.cancel")}
            onClick={handleCancel}
            width="auto"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t("dashboard.agentProfile.contactDetails.saveChanges")}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            disabled={!isValid || isPending}
            padding="var(--volunteer-profile-section-card-header-button-padding)"
          />
        </ButtonRow>
      )}
    </Container>
  );
});
