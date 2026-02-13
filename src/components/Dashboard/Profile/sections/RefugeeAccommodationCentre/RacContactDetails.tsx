"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiPersonGet } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { createRacContactDetailsSchema, RacContactDetailsFormData } from "./RacContactDetailsSchema";
import Divider from "../../common/Divider";
import { useUpdatePersonContact } from "@/hooks/useUpdateRacPersonContact";
import { AgentRoles } from "@/config/constants";

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
  person: ApiPersonGet | undefined;
  isEditing: boolean;
  handleEditClick: () => void;
  handleCancelClick: () => void;
};

export type ContactDetailsRef = {
  handleEditClick: () => void;
};

const roleKeys = Object.values(AgentRoles);

export const RacContactDetails = forwardRef<ContactDetailsRef, Props>(function ContactDetails(
  { person, isEditing, handleEditClick, handleCancelClick },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateAgent, isPending } = useUpdatePersonContact(String(person?.id));

  const roleOptions = roleKeys.map((key) => t(`dashboard.rac.roles.${key}`));

  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  roleKeys.forEach((key, index) => {
    const label = roleOptions[index];
    keyToLabel[key] = label;
    labelToKey[label] = key;
  });

  const schema = createRacContactDetailsSchema(t);

  const initialFormValues = useMemo((): RacContactDetailsFormData => {
    // const { agent } = person;
    return {
      firstName: person?.firstName || "",
      middleName: person?.middleName || "",
      lastName: person?.lastName || "",
      role: [],
      email: person?.email || "",
      phone: person?.phone || "",
      landline: "",
    };
  }, [person]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RacContactDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  useImperativeHandle(ref, () => ({
    handleEditClick,
  }));

  const handleCancel = () => {
    reset();
    handleCancelClick();
  };

  const onSubmit = (values: RacContactDetailsFormData) => {
    updateAgent(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        role: values?.role?.length ? (values.role as AgentRoles[]) : undefined,
        email: values.email,
        phone: values.phone,
        landline: values.landline,
      },
      {
        onSuccess: () => {
          handleCancelClick();
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
              render={({ field }: { field: ControllerRenderProps<RacContactDetailsFormData, "firstName"> }) => (
                <EditableField
                  mode="edit"
                  type="text"
                  label={t("dashboard.rac.contactDetails.firstName")}
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
              render={({ field }: { field: ControllerRenderProps<RacContactDetailsFormData, "middleName"> }) => (
                <EditableField
                  mode="edit"
                  type="text"
                  label={t("dashboard.rac.contactDetails.middleName")}
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
              render={({ field }: { field: ControllerRenderProps<RacContactDetailsFormData, "lastName"> }) => (
                <EditableField
                  mode="edit"
                  type="text"
                  label={t("dashboard.rac.contactDetails.lastName")}
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
              <label>{t("dashboard.rac.contactDetails.fullName")}</label>
              <span>{`${person?.firstName} ${person?.middleName || ""} ${person?.lastName}`}</span>
            </>
          </FieldWrapper>
        )}
        <Divider />
        <Controller
          name="role"
          control={control}
          render={({ field }: { field: ControllerRenderProps<RacContactDetailsFormData, "role"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="checkbox-list"
              label={t("dashboard.rac.roles.label")}
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
          render={({ field }: { field: ControllerRenderProps<RacContactDetailsFormData, "email"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.rac.contactDetails.email")}
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
          render={({ field }: { field: ControllerRenderProps<RacContactDetailsFormData, "phone"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.rac.contactDetails.mobile")}
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
          render={({ field }: { field: ControllerRenderProps<RacContactDetailsFormData, "landline"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.rac.contactDetails.landline")}
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
            text={t("dashboard.rac.cancel")}
            onClick={handleCancel}
            width="auto"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
            height="var(--volunteer-profile-section-card-header-button-height)"
            textFontSize="var(--volunteer-profile-section-card-header-button-textFontSize)"
            padding="var(--rac-profile-section-card-header-button-padding)"
          />
          <Button
            text={t("dashboard.rac.saveChanges")}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            disabled={!isValid || isPending}
            height="var(--volunteer-profile-section-card-header-button-height)"
            textFontSize="var(--volunteer-profile-section-card-header-button-textFontSize)"
            padding="var(--rac-profile-section-card-header-button-padding)"
          />
        </ButtonRow>
      )}
    </Container>
  );
});
