"use client";
import Image from "next/image";
import styled from "styled-components";
import { formatDateTime, getImageUrl } from "@/utils";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import Divider from "../common/Divider";
import StatusBadge from "../common/StatusBadge";
import avatarImage from "@/assets/images/profile.svg";

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
  align-items: center;

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

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StatusGroup = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: ${({ columns }) => (columns === 3 ? "1fr 1fr 1fr" : "1fr 2fr")};
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.25rem;
  ${BadgeContainer} {
    margin-left: ${({ columns }) => (columns === 3 ? "6px" : "0")};
  }

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

interface Props {
  volunteer: ApiVolunteerGet;
}

export function VolunteerHeader({ volunteer }: Props) {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const joinedSince = formatDateTime(volunteer.createdAt);
  const fullName = `${volunteer.person.firstName} ${volunteer.person.lastName}`;

  const handleStatusChangeClick = () => {
    // setIsModalOpen(true);
  };

  const isAvatarAvailable = () => {
    return (
      <>
        {volunteer.person.avatarUrl ? (
          <Image
            src={getImageUrl(volunteer.person.avatarUrl)}
            alt={volunteer.person.firstName || "Volunteer Avatar"}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Image src={avatarImage} alt="Avatar Placeholder" fill style={{ objectFit: "cover" }} />
        )}
      </>
    );
  };

  return (
    <HeaderContainer>
      <Card>
        <ProfileContent>
          <AvatarContainer>{isAvatarAvailable()}</AvatarContainer>

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
