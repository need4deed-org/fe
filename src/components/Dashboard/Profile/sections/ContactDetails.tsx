"use client";
import Button from "@/components/core/button/Button/Button";
import { Heading2, Heading4, Paragraph } from "@/components/styled/text";
import { ChatsCircle } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 8px;
  background: var(--color-white);
  border-radius: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1;
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
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 24px 0;
  gap: 32px;
  width: 100%;
  border-bottom: 1px solid #ebedf7;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 276px;
`;

const Value = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

interface Props {
  volunteer: ApiVolunteerGet;
}

export function ContactDetails({ volunteer }: Props) {
  const { t } = useTranslation();

  const handleEditClick = () => {
    // TODO: Implement edit functionality
  };

  const phoneNumber = volunteer.person.phone || t("dashboard.volunteerProfile.contactDetails.notProvided");
  const email = volunteer.person.email || t("dashboard.volunteerProfile.contactDetails.notProvided");

  const formatAddress = () => {
    const addr = volunteer.person.address;
    if (!addr || typeof addr !== "object") {
      return t("dashboard.volunteerProfile.contactDetails.notProvided");
    }
    const postcode = addr.postcode && typeof addr.postcode === "object" ? addr.postcode.code : addr.postcode;
    const parts = [addr.street, addr.city, postcode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : t("dashboard.volunteerProfile.contactDetails.notProvided");
  };

  const address = formatAddress();

  // TODO: Get this from volunteer data when available
  const waysToContact = "Whatsapp, Telegram, mobile phone";

  return (
    <Container data-testid="contact-details-container">
      <Header>
        <HeaderRow>
          <HeaderContent>
            <TitleRow>
              <IconContainer>
                <ChatsCircle size={40} weight="fill" />
              </IconContainer>
              <Heading2>{t("dashboard.volunteerProfile.contactDetails.title")}</Heading2>
            </TitleRow>
          </HeaderContent>
          <Button
            text={t("dashboard.volunteerProfile.contactDetails.edit")}
            onClick={handleEditClick}
            width="auto"
            padding="16px 24px"
          />
        </HeaderRow>
      </Header>

      <Details>
        <DetailRow>
          <Label>
            <Heading4>{t("dashboard.volunteerProfile.contactDetails.phoneNumber")}</Heading4>
          </Label>
          <Value>
            <Paragraph>{phoneNumber}</Paragraph>
          </Value>
        </DetailRow>

        <DetailRow>
          <Label>
            <Heading4>{t("dashboard.volunteerProfile.contactDetails.email")}</Heading4>
          </Label>
          <Value>
            <Paragraph>{email}</Paragraph>
          </Value>
        </DetailRow>

        <DetailRow>
          <Label>
            <Heading4>{t("dashboard.volunteerProfile.contactDetails.address")}</Heading4>
          </Label>
          <Value>
            <Paragraph>{address}</Paragraph>
          </Value>
        </DetailRow>

        <DetailRow>
          <Label>
            <Heading4>{t("dashboard.volunteerProfile.contactDetails.waysToContact")}</Heading4>
          </Label>
          <Value>
            <Paragraph>{waysToContact}</Paragraph>
          </Value>
        </DetailRow>
      </Details>
    </Container>
  );
}
