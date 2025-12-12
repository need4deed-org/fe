"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { Heading2 } from "@/components/styled/text";
import { ChatsCircle } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useMutationQuery } from "@/hooks";
import { apiPathVolunteer } from "@/config/constants";

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

type UpdateVolunteerContactData = {
  person: {
    id: number;
    phone?: string;
    email?: string;
    address?: {
      id: string | number;
      street?: string;
      city?: string;
      postcode?: {
        code?: string;
      };
    };
  };
};

const useUpdateVolunteerContact = (volunteerId: number) => {
  return useMutationQuery<UpdateVolunteerContactData, ApiVolunteerGet>({
    apiPath: `${apiPathVolunteer}${volunteerId}`,
    method: "patch",
    successMessage: "dashboard.volunteerProfile.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["volunteer", volunteerId],
  });
};

interface Props {
  volunteer: ApiVolunteerGet;
}

export function ContactDetails({ volunteer }: Props) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateContact, isPending } = useUpdateVolunteerContact(volunteer.id);

  const formatAddress = () => {
    const addr = volunteer.person.address;
    if (!addr || typeof addr !== "object") {
      return "";
    }
    const postcode = addr.postcode && typeof addr.postcode === "object" ? addr.postcode.code : addr.postcode;
    const parts = [addr.street, addr.city, postcode].filter(Boolean);
    return parts.join(", ");
  };

  const [phoneNumber, setPhoneNumber] = useState(volunteer.person.phone || "");
  const [email, setEmail] = useState(volunteer.person.email || "");
  const [address, setAddress] = useState(formatAddress());
  const [waysToContact, setWaysToContact] = useState<string[]>(["Whatsapp", "Telegram", "Mobile phone"]);

  // Sync local state when volunteer data changes (after refetch)
  useEffect(() => {
    setPhoneNumber(volunteer.person.phone || "");
    setEmail(volunteer.person.email || "");
    setAddress(formatAddress());
  }, [volunteer]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPhoneNumber(volunteer.person.phone || "");
    setEmail(volunteer.person.email || "");
    setAddress(formatAddress());
    setWaysToContact(["Whatsapp", "Telegram", "Mobile phone"]);
    setIsEditing(false);
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

  const handleSave = () => {
    const addressData = parseAddress(address);

    updateContact(
      {
        person: {
          id: volunteer.person.id,
          phone: phoneNumber,
          email: email,
          address: {
            id: volunteer.person.address?.id || "",
            street: addressData.street,
            city: addressData.city,
            postcode: {
              code: addressData.postcode,
            },
          },
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
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
        <EditableField
          mode={isEditing ? "edit" : "display"}
          type="text"
          label={t("dashboard.volunteerProfile.contactDetails.phoneNumber")}
          value={phoneNumber}
          setValue={(v) => setPhoneNumber(v as string)}
        />

        <EditableField
          mode={isEditing ? "edit" : "display"}
          type="text"
          label={t("dashboard.volunteerProfile.contactDetails.email")}
          value={email}
          setValue={(v) => setEmail(v as string)}
        />

        <EditableField
          mode={isEditing ? "edit" : "display"}
          type="text"
          label={t("dashboard.volunteerProfile.contactDetails.address")}
          value={address}
          setValue={(v) => setAddress(v as string)}
        />

        <EditableField
          mode={isEditing ? "edit" : "display"}
          type="checkbox-list"
          label={t("dashboard.volunteerProfile.contactDetails.waysToContact")}
          value={waysToContact}
          setValue={(v) => setWaysToContact(v as string[])}
          options={["Whatsapp", "Telegram", "Mobile phone", "Email", "SMS"]}
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
            onClick={handleSave}
            width="auto"
            padding="16px 24px"
            disabled={isPending}
          />
        </ButtonRow>
      )}
    </Container>
  );
}
