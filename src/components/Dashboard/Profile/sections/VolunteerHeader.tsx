"use client";
import Image from "next/image";
import styled from "styled-components";
import { formatDateTime, getImageUrl } from "@/utils";
import { ApiVolunteerGet, VolunteerStateTypeType } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Divider from "../common/Divider";
import Modal from "../common/Modal";
import RadioGroup from "../common/RadioGroup";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";
import CustomCalendarInput from "../common/CustomCalendarInput";
import "react-datepicker/dist/react-datepicker.css";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  height: 280px;
  width: 280px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Name = styled.h2`
  font-size: 28px;
  font-weight: 600;
`;

const VolunteerSince = styled.p`
  font-size: 16px;
  font-weight: 400;
`;

const BadgesGrid = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusGroup = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: ${({ columns }) => (columns === 3 ? "1fr 1fr 1fr" : "1fr 2fr")};
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
  }
`;

const Label = styled.span`
  font-weight: 600;
  font-size: 20px;
`;

const StatusChange = styled.span`
  font-size: 16px;
  cursor: pointer;
  width: fit-content;
  display: flex;
  font-weight: 600;
  justify-self: flex-end;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Badge = styled.span<{ variant?: "primary" | "secondary" }>`
  background: ${({ variant }) => (variant === "primary" ? "#E6F4FF" : "#F3F4F6")};
  color: ${({ variant }) => (variant === "primary" ? "#1E40AF" : "#374151")};
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
`;

const CancelBtn = styled.button`
  padding: 8px 16px;
  border-radius: 125px;
  background: transparent;

  border: 2px solid brown;
  cursor: pointer;

  &:hover {
    background: rgba(165, 42, 42, 0.1); /* Light brown hover effect */
  }
`;

const SaveBtn = styled(CancelBtn)`
  background: brown;
  color: white;
  border: none;

  &:disabled {
    background: #d3d3d3; 
    cursor: not-allowed;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

interface Props {
  volunteer: ApiVolunteerGet;
}

export function VolunteerHeader({ volunteer }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEngagementStatus, setSelectedEngagementStatus] = useState<string>("");
  const [optionalDate, setOptionalDate] = useState<Date | null>(null); // State for the optional calendar input

  const { t } = useTranslation();

  const joinedSince = formatDateTime(volunteer.createdAt);
  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;

  const handleStatusChangeClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEngagementStatus("");
    setIsModalOpen(false);
  };

  // const updateMutation = useUpdateMutation<{ status: string }>();

  const handleSave = () => {
    // if (selectedEngagementStatus) {
    //   updateMutation.mutate({
    //     url: `/api/volunteer/${volunteer.id}/update-status`, // Replace with your actual API endpoint
    //     data: { status: selectedEngagementStatus, optionalDate }, // Include optionalDate if needed
    //   });
    //   setIsModalOpen(false);
    // }
  };

  return (
    <HeaderContainer>
      <Card>
        <ProfileContent>
          <AvatarContainer>
            <Image
              src={getImageUrl(volunteer.person.avatarUrl || "")}
              alt={volunteer.person.firstName || "Volunteer Avatar"}
              fill
              style={{ objectFit: "cover" }}
            />
          </AvatarContainer>

          <ProfileInfo>
            <NameSection>
              <Name>{fullName}</Name>
              <VolunteerSince>Volunteer since {joinedSince}</VolunteerSince>
            </NameSection>
            <BadgesGrid>
              <StatusSection>
                <StatusGroup columns={3}>
                  <Label>{t("volunteerProfile.volunteerHeader.engagementStatus_title")}</Label>
                  <BadgeContainer>
                    <Badge variant="primary">{volunteer.statusEngagement}</Badge>
                  </BadgeContainer>
                  <StatusChange onClick={handleStatusChangeClick}>
                    {t("volunteerProfile.volunteerHeader.change_status")}
                  </StatusChange>
                </StatusGroup>
                <Divider />
                <StatusGroup columns={2}>
                  <Label>{t("volunteerProfile.volunteerHeader.matchStatus_title")}</Label>
                  <BadgeContainer>
                    <Badge variant="primary">{volunteer.statusMatch}</Badge>
                  </BadgeContainer>
                </StatusGroup>
                <Divider />
                <StatusGroup columns={2}>
                  <Label>{t("volunteerProfile.volunteerHeader.volunteerType_title")}</Label>
                  <BadgeContainer>
                    {volunteer.statusType.map((type: VolunteerStateTypeType) => (
                      <Badge key={type} variant="primary">
                        {type}
                      </Badge>
                    ))}
                  </BadgeContainer>
                </StatusGroup>
              </StatusSection>
            </BadgesGrid>
          </ProfileInfo>
        </ProfileContent>
      </Card>

      {isModalOpen && (
        <Modal title={t("volunteerProfile.volunteerHeader.modalData.title")} onClose={handleModalClose}>
          <RadioGroup
            options={[
              {
                value: t("volunteerProfile.volunteerHeader.modalData.options.unresponsive"),
                label: t("volunteerProfile.volunteerHeader.modalData.options.unresponsive"),
                description: t("volunteerProfile.volunteerHeader.modalData.options.description"),
              },
              {
                value: t("volunteerProfile.volunteerHeader.modalData.options.temporarily_unavailable"),
                label: t("volunteerProfile.volunteerHeader.modalData.options.temporarily_unavailable"),
                description: t("volunteerProfile.volunteerHeader.modalData.options.description2"),
                renderComponent: (
                  <CustomCalendarInput
                    value={optionalDate}
                    onChange={(date) => setOptionalDate(date)}
                    label={t("volunteerProfile.volunteerHeader.modalData.options.returnDate")}
                  />
                ),
              },
              {
                value: t("volunteerProfile.volunteerHeader.modalData.options.inactive"),
                label: t("volunteerProfile.volunteerHeader.modalData.options.inactive"),
                description: t("volunteerProfile.volunteerHeader.modalData.options.description3"),
              },
            ]}
            selectedValue={selectedEngagementStatus}
            onChange={setSelectedEngagementStatus}
          />
          <BtnContainer>
            <CancelBtn onClick={handleModalClose}>{t("volunteerProfile.volunteerHeader.modalData.cancel")}</CancelBtn>
            <SaveBtn onClick={handleSave} disabled={!selectedEngagementStatus}>
              {t("volunteerProfile.volunteerHeader.modalData.save")}
            </SaveBtn>
          </BtnContainer>
        </Modal>
      )}
    </HeaderContainer>
  );
}
