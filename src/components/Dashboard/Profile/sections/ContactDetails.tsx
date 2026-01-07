"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { Heading2 } from "@/components/styled/text";
import { useUpdateVolunteerContact } from "@/hooks/useUpdateVolunteerContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatsCircle } from "@phosphor-icons/react";
import { ApiVolunteerGet, VolunteerCommunicationType } from "need4deed-sdk";
import { useEffect, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ContactDetailsFormData, createContactDetailsSchema } from "./ContactDetails/contactDetailsSchema";

const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  padding: var(--profile-section-padding);
  gap: ${(props) => (props.$isEditing ? "var(--profile-section-gap-editing)" : "var(--profile-section-gap)")};
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  margin-bottom: var(--profile-section-margin-bottom);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--profile-section-title-gap);
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: var(--color-papaya);
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: var(--profile-section-gap);
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--profile-section-button-row-gap);
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

interface Props {
  volunteer: ApiVolunteerGet;
}

const preferredCommunicationTypeKeys = Object.values(VolunteerCommunicationType);

export function ContactDetails({ volunteer }: Props) {
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
      <Header>
        <TitleRow>
          <IconContainer>
            <ChatsCircle size={40} weight="fill" />
          </IconContainer>
          <Heading2>{t("dashboard.volunteerProfile.contactDetails.title")}</Heading2>
        </TitleRow>
        {!isEditing && (
          <Button
            text={t("dashboard.volunteerProfile.contactDetails.edit")}
            onClick={handleEditClick}
            width="auto"
            padding="16px 24px"
          />
        )}
      </Header>

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
            padding="16px 24px"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="2px solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.volunteerProfile.contactDetails.saveChanges")}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            padding="16px 24px"
            disabled={!isValid || isPending}
          />
        </ButtonRow>
      )}
    </Container>
  );
}
