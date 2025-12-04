"use client";
import Image from "next/image";
import styled from "styled-components";
import { formatDateTime, getImageUrl } from "@/utils";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import Divider from "../common/Divider";
import StatusBadge from "../common/StatusBadge";
import { defaultAvatarVolunteerProfile } from "@/config/constants";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-process-section-header-gap);
`;

const Card = styled.div`
  background: var(--color-white);
  border-radius: var(--numbering-div-border-radius);
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-process-section-header-gap);
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  height: var(--homepage-hero-section-logo-width);
  width: var(--homepage-hero-section-logo-width);
  border-radius: var(--percent-50);
  overflow: hidden;
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
  gap: var(--dashboard-navigation-bar-option-gap);
`;

const Name = styled.h2`
  font-size: var(--text-h1-font-size);
  font-weight: var(--text-h2-font-weight);
`;

const VolunteerSince = styled.p`
  font-size: var(--homepage-testimonial-card-text-p-font-size);
  font-weight: var(--homepage-process-section-card-info-text-fontWeight);
`;

const BadgesGrid = styled.div`
  margin-top: var(--homepage-section-container-gap);
  display: flex;
  flex-direction: column;
  gap: var(--homepage-section-container-gap);
`;

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--activities-container-gap);
`;

const StatusGroup = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: ${({ columns }) => (columns === 3 ? "1fr 1fr 1fr" : "1fr 2fr")};
  align-items: center;
  column-gap: var(--homepage-section-container-gap);
  row-gap: var(--dashboard-navigation-bar-option-gap);
  ${BadgeContainer} {
    margin-left: ${({ columns }) => (columns === 3 ? "6px" : "0")};
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    row-gap: var(--dashboard-navigation-bar-option-gap);
  }
`;

const Label = styled.span`
  font-weight: var(--text-activity-tag-font-weight);
  font-size: var(--text-h3-font-size);
`;

const StatusChange = styled.span`
  font-size: var(--text-p-font-size);
  cursor: pointer;
  width: fit-content;
  display: flex;
  font-weight: var(--text-activity-tag-font-weight);
  justify-self: flex-end;
`;

interface Props {
  volunteer: ApiVolunteerGet;
}

export function VolunteerHeader({ volunteer }: Props) {
  const { t } = useTranslation();

  const joinedSince = formatDateTime(volunteer.createdAt);
  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;

  const handleStatusChangeClick = () => {
    //setting modal open logic here
  };

  const initialAvatarUrl = getImageUrl(volunteer.person.avatarUrl || defaultAvatarVolunteerProfile)

  return (
    <HeaderContainer>
      <Card>
        <ProfileContent>
          <AvatarContainer>
            <Image src={initialAvatarUrl} alt={volunteer.person.firstName} fill style={{ objectFit: "cover" }} />
          </AvatarContainer>

          <ProfileInfo>
            <NameSection>
              <Name>{fullName}</Name>
              <VolunteerSince>Volunteer since {joinedSince}</VolunteerSince>
            </NameSection>
            <BadgesGrid>
              <StatusSection>
                <StatusGroup columns={3}>
                  <Label>{t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}</Label>
                  <BadgeContainer>
                    <StatusBadge status={volunteer.statusEngagement} />
                  </BadgeContainer>
                  <StatusChange onClick={handleStatusChangeClick}>
                    {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
                  </StatusChange>
                </StatusGroup>
                <Divider />
                <StatusGroup columns={2}>
                  <Label>{t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}</Label>
                  <BadgeContainer>
                    <StatusBadge status={volunteer.statusMatch} />
                  </BadgeContainer>
                </StatusGroup>
                <Divider />
                <StatusGroup columns={2}>
                  <Label>{t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}</Label>
                  <BadgeContainer>
                    {" "}
                    <StatusBadge status={volunteer.statusType} />
                  </BadgeContainer>
                </StatusGroup>
              </StatusSection>
            </BadgesGrid>
          </ProfileInfo>
        </ProfileContent>
      </Card>
    </HeaderContainer>
  );
}
