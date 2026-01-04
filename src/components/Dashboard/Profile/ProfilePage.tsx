import React from "react";
import styled from "styled-components";
import { ProfileCardTypes } from "./types/types";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ApiVolunteerGet } from "need4deed-sdk";
// import { PROFILE_CARD_CONFIG } from "./config/ProfileSectionConfig";
import { useTranslation } from "react-i18next";
import { VolunteerHeader } from "./sections/VolunteerHeader";
import { ContactDetails } from "./sections/ContactDetails";
import { VolunteerProfileSection } from "./sections/VolunteerProfileSection";
import { CommentsSection } from "./sections/CommentsSection";
import { VolunteerProfileDocumentSection } from "./sections/VolunteerProfileDocumentSection";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 20px;
  color: var(--color-midnight);
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
  font-size: 20px;
  color: var(--color-midnight);
  text-decoration: none;
  transition: color 0.2s;
  margin-bottom: 24px;
`;

const Heading = styled.h1`
  font-size: 48px;
  margin-bottom: 24px;
  font-weight: 600;
`;

// const SECTION_COMPONENTS: Partial<
//   Record<ProfileCardTypes, React.ComponentType<{ volunteer: ApiVolunteerGet | ApiVolunteerGet[] }>>
// > = {
//   [ProfileCardTypes.VOLUNTEER_HEADER]: VolunteerHeader,
// };

// const CardComponent = ({ type, volunteers }: ProfilePageProps) => {
//   const SectionComponent = type ? SECTION_COMPONENTS[type] : undefined;
//   if (!SectionComponent) return null;
//   const Component = SectionComponent;
//   return <Component volunteer={volunteers} />;
// };

interface ProfilePageProps {
  type?: ProfileCardTypes;
  volunteer: ApiVolunteerGet;
}

const ProfilePage = ({ volunteer }: ProfilePageProps) => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <BackLink href="/dashboard">
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackLink>

      <Heading>{t("dashboard.volunteerProfile.volunteersProfile")}</Heading>

      {/* TODO:implement similar logic in here for all profile sections except header !!! */}
      {/* {PROFILE_CARD_CONFIG.map((card) => (
        <Card key={card.type}>
          <CardComponent type={card.type} volunteers={volunteers} />
        </Card>
      ))} */}

      <Card>
        <VolunteerHeader volunteer={volunteer} />
      </Card>

      <ContactDetails volunteer={volunteer} />

      <VolunteerProfileSection volunteer={volunteer} />

      <CommentsSection volunteer={volunteer} />

      <VolunteerProfileDocumentSection volunteer={volunteer} />
    </PageContainer>
  );
};

export default ProfilePage;
