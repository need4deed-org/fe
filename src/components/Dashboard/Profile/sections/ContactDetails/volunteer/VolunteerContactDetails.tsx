"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { useUpdateVolunteerContact } from "@/hooks/useUpdateVolunteerContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiVolunteerGet, VolunteerCommunicationType } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ButtonRow, Container, Details, useEnumTranslation } from "../shared";
import { ContactDetailsRef } from "../types";
import { createVolunteerContactDetailsSchema, VolunteerContactDetailsFormData } from "./volunteerContactDetailsSchema";

type Props = {
  volunteer: ApiVolunteerGet;
};

const COMMUNICATION_TYPES = Object.values(VolunteerCommunicationType);

const formatAddress = (address: ApiVolunteerGet["person"]["address"]) => {
  if (!address || typeof address !== "object") return "";

  const postcode = address.postcode && typeof address.postcode === "object" ? address.postcode.code : address.postcode;
  return [address.street, address.city, postcode].filter(Boolean).join(", ");
};

const parseAddress = (addressString: string) => {
  const [street = "", city = "", postcode = ""] = addressString.split(",").map((part) => part.trim());
  return { street, city, postcode };
};

export const VolunteerContactDetails = forwardRef<ContactDetailsRef, Props>(function VolunteerContactDetails(
  { volunteer },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateContact, isPending } = useUpdateVolunteerContact(String(volunteer.id));
  const [isEditing, setIsEditing] = useState(false);

  const { options, keysToLabels, labelsToKeys } = useEnumTranslation(
    COMMUNICATION_TYPES,
    "dashboard.volunteerProfile.contactDetails.preferredCommunicationType",
  );

  const schema = createVolunteerContactDetailsSchema(t);

  const initialFormValues = useMemo(
    (): VolunteerContactDetailsFormData => ({
      phone: volunteer.person.phone ?? "",
      email: volunteer.person.email ?? "",
      address: formatAddress(volunteer.person.address),
      preferredCommunicationType: volunteer.preferredCommunicationType ?? [],
    }),
    [volunteer],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<VolunteerContactDetailsFormData>({
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

  const onSubmit = (values: VolunteerContactDetailsFormData) => {
    const addressData = parseAddress(values.address);

    updateContact(
      {
        person: {
          ...volunteer.person,
          address: {
            id: volunteer.person.address?.id,
            street: addressData.street,
            city: addressData.city,
            postcode: { code: addressData.postcode },
          },
        },
        preferredCommunicationType: values.preferredCommunicationType,
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
    <Container data-testid="volunteer-contact-details-container" $isEditing={isEditing}>
      <Details>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
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
          render={({ field }) => (
            <EditableField
              mode={mode}
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
          render={({ field }) => (
            <EditableField
              mode={mode}
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
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="checkbox-list"
              label={t("dashboard.volunteerProfile.contactDetails.preferredCommunicationType.label")}
              value={keysToLabels(field.value)}
              setValue={(value) => field.onChange(labelsToKeys(Array.isArray(value) ? value : [value]))}
              options={options}
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
            disabled={!isDirty || !isValid || isPending}
          />
        </ButtonRow>
      )}
    </Container>
  );
});
