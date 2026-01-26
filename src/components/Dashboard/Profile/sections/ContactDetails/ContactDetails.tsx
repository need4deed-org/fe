"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { useUpdateVolunteerContact } from "@/hooks/useUpdateVolunteerContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiVolunteerGet, VolunteerCommunicationType } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ContactDetailsFormData, createContactDetailsSchema } from "./contactDetailsSchema";

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

const formatAddress = (address: ApiVolunteerGet["person"]["address"]) => {
  if (!address || typeof address !== "object") {
    return "";
  }
  const postcode = address.postcode && typeof address.postcode === "object" ? address.postcode.code : address.postcode;
  const parts = [address.street, address.city, postcode].filter(Boolean);
  return parts.join(", ");
};

const parseAddress = (addressString: string) => {
  // Address format: "street, city, postcode"
  const parts = addressString.split(",").map((part) => part.trim());
  return {
    street: parts[0] || "",
    city: parts[1] || "",
    postcode: parts[2] || "",
  };
};

type Props = {
  volunteer: ApiVolunteerGet;
};

export type ContactDetailsRef = {
  handleEditClick: () => void;
};

const preferredCommunicationTypeKeys = Object.values(VolunteerCommunicationType);

export const ContactDetails = forwardRef<ContactDetailsRef, Props>(function ContactDetails({ volunteer }, ref) {
  const { t } = useTranslation();
  const { mutate: updateContact, isPending } = useUpdateVolunteerContact(String(volunteer.id));
  const [isEditing, setIsEditing] = useState(false);

  const preferredCommunicationTypeOptions = preferredCommunicationTypeKeys.map((key) =>
    t(`dashboard.volunteerProfile.contactDetails.preferredCommunicationType.${key}`),
  );

  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  preferredCommunicationTypeKeys.forEach((key, index) => {
    const label = preferredCommunicationTypeOptions[index];
    keyToLabel[key] = label;
    labelToKey[label] = key;
  });

  const schema = createContactDetailsSchema(t);

  const initialFormValues = useMemo(
    () => ({
      phone: volunteer.person.phone || "",
      email: volunteer.person.email || "",
      address: formatAddress(volunteer.person.address),
      preferredCommunicationType: volunteer.preferredCommunicationType || [],
    }),
    [volunteer],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactDetailsFormData>({
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

  const onSubmit = (values: ContactDetailsFormData) => {
    const addressData = parseAddress(values.address);

    updateContact(
      {
        person: {
          id: volunteer.person.id,
          phone: values.phone,
          email: values.email,
          address: {
            id: volunteer.person.address?.id,
            street: addressData.street,
            city: addressData.city,
            postcode: {
              code: addressData.postcode,
            },
          },
        },
        preferredCommunicationType: values.preferredCommunicationType,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  // Reset form when volunteer data changes (after successful mutation & refetch)
  useEffect(() => {
    if (!isEditing) {
      reset(initialFormValues);
    }
  }, [initialFormValues, isEditing, reset]);

  return (
    <Container data-testid="contact-details-container" $isEditing={isEditing}>
      <Details>
        <Controller
          name="phone"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactDetailsFormData, "phone"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.phone")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactDetailsFormData, "email"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.email")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactDetailsFormData, "address"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.address")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.address?.message}
            />
          )}
        />

        <Controller
          name="preferredCommunicationType"
          control={control}
          render={({
            field,
          }: {
            field: ControllerRenderProps<ContactDetailsFormData, "preferredCommunicationType">;
          }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="checkbox-list"
              label={t("dashboard.volunteerProfile.contactDetails.preferredCommunicationType.label")}
              value={field.value.map((key) => keyToLabel[key])}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                field.onChange(labels.map((label) => labelToKey[label]));
              }}
              options={preferredCommunicationTypeOptions}
              errorMessage={errors.preferredCommunicationType?.message}
            />
          )}
        />
      </Details>

      {isEditing && (
        <ButtonRow>
          <Button
            text={t("dashboard.volunteerProfile.contactDetails.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t("dashboard.volunteerProfile.contactDetails.saveChanges")}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            disabled={!isValid || isPending}
          />
        </ButtonRow>
      )}
    </Container>
  );
});
