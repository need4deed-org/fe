"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { Heading2 } from "@/components/styled/text";
import { useUpdateVolunteerContact } from "@/hooks/useUpdateVolunteerContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatsCircle } from "@phosphor-icons/react";
import { ApiVolunteerGet, VolunteerCommunicationType } from "need4deed-sdk";
import { useMemo, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ContactDetailsFormData, createContactDetailsSchema } from "./ContactDetails/contactDetailsSchema";

const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: ${(props) => (props.$isEditing ? "16px" : "8px")};
  background: var(--color-white);
  border-radius: 24px;
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
  gap: 16px;
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
  gap: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
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

const waysToContactKeys = Object.values(VolunteerCommunicationType);

export function ContactDetails({ volunteer }: Props) {
  const { t } = useTranslation();
  const { mutate: updateContact, isPending } = useUpdateVolunteerContact(volunteer.id);
  const [isEditing, setIsEditing] = useState(false);

  const waysToContactOptions = waysToContactKeys.map((key) =>
    t(`dashboard.volunteerProfile.contactDetails.waysToContact.${key}`),
  );

  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  waysToContactKeys.forEach((key, index) => {
    const label = waysToContactOptions[index];
    keyToLabel[key] = label;
    labelToKey[label] = key;
  });

  const schema = createContactDetailsSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: useMemo(
      () => ({
        phoneNumber: volunteer.person.phone || "",
        email: volunteer.person.email || "",
        address: formatAddress(volunteer.person.address),
        // TODO: Load actual waysToContact from volunteer data when available
        waysToContact: [],
      }),
      [volunteer],
    ),
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
          phone: values.phoneNumber,
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
        waysToContact: values.waysToContact,
      },
      {
        onSuccess: () => {
          reset(values);
          setIsEditing(false);
        },
      },
    );
  };

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
          name="phoneNumber"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactDetailsFormData, "phoneNumber"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="text"
              label={t("dashboard.volunteerProfile.contactDetails.phoneNumber")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.phoneNumber?.message}
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
          name="waysToContact"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactDetailsFormData, "waysToContact"> }) => (
            <EditableField
              mode={isEditing ? "edit" : "display"}
              type="checkbox-list"
              label={t("dashboard.volunteerProfile.contactDetails.waysToContact.label")}
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
