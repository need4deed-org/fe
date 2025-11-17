import React from "react";
import styled from "styled-components";
import { ProfileCardTypes } from "./types/types";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { ApiVolunteerGet } from "need4deed-sdk";
import VolunteerHeader from "./sections/VolunteerHeader";
import { PROFILE_CARD_CONFIG } from "./config/ProfileSectionConfig";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 20px;
  background: #f1a9f5;
  color: var(--color-midnight);
  background: linear-gradient(
    0deg,
    rgba(241, 169, 245, 1) 3%,
    rgba(241, 176, 244, 1) 36%,
    rgba(246, 238, 231, 1) 77%
  ); /* White background based on new design */
`;

const Card = styled.section`
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }
`;

const SECTION_COMPONENTS: Partial<
  Record<ProfileCardTypes, React.ComponentType<{ volunteer: ApiVolunteerGet | ApiVolunteerGet[] }>>
> = {
  [ProfileCardTypes.VOLUNTEER_HEADER]: VolunteerHeader,
};

interface ProfilePageProps {
  type?: ProfileCardTypes;
  volunteers: ApiVolunteerGet | ApiVolunteerGet[];
}

const CardComponent = ({ type, volunteers }: ProfilePageProps) => {
  const SectionComponent = type ? SECTION_COMPONENTS[type] : undefined;
  if (!SectionComponent) return null;
  const Component = SectionComponent;
  return <Component volunteer={volunteers} />;
};

const ProfilePage = ({ volunteers }: ProfilePageProps) => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <BackLink href="/dashboard">
        <ArrowLeft size={16} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackLink>
      <h1>{t("dashboard.volunteerProfile.volunteersProfile")}</h1>
      {PROFILE_CARD_CONFIG.map((card) => (
        <Card key={card.type}>
          <CardComponent type={card.type} volunteers={volunteers} />
        </Card>
      ))}
    </PageContainer>
  );
};

export default ProfilePage;
