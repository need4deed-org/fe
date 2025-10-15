import React from "react";
import styled from "styled-components";
import { VolunteerHeader } from "./sections/VolunteerHeader";
import { ContactDetails } from "./sections/ContactDetails";
import { Opportunities } from "./sections/Opportunities";
import { CoordinatorComments } from "./sections/CoordinatorComments";
import { Documents } from "./sections/Documents";
import { ActivityLog } from "./sections/ActivityLog";
import { ProfileCardProps, ProfileCardTypes } from "./types/types";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useGetQuery } from "@/hooks";
import { apiVolunteerProfile } from "@/config/constants";
import { ApiVolunteerGet } from "need4deed-sdk";
import { PROFILE_CARD_CONFIG } from "./config/profileCardConfig";
import { VolunteerProfileSection } from "./sections/VolunteerProfile";

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

const SECTION_COMPONENTS = {
  [ProfileCardTypes.VOLUNTEER_HEADER]: VolunteerHeader,
  [ProfileCardTypes.CONTACT]: ContactDetails,
  [ProfileCardTypes.VOLUNTEER]: VolunteerProfileSection,
  // [ProfileCardTypes.OPPORTUNITIES]: Opportunities,
  // [ProfileCardTypes.COORDINATE]: CoordinatorComments,
  // [ProfileCardTypes.DOCUMENTS]: Documents,
  // [ProfileCardTypes.ACTIVITY]: ActivityLog,
};

interface ProfilePageProps {
  type?: ProfileCardTypes;
  volunteers: ApiVolunteerGet;
}

const CardComponent = ({ type, volunteers }: ProfilePageProps) => {
  const SectionComponent = SECTION_COMPONENTS[type as ProfileCardTypes];
  return <SectionComponent volunteer={volunteers} />;
};

const Profile = ({ volunteers }: ProfilePageProps) => {
  return (
    <PageContainer>
      <BackLink href="/dashboard">
        <ArrowLeft size={16} />
        Back to dashboard
      </BackLink>
      <h1>Volunteers Profile</h1>
      {PROFILE_CARD_CONFIG.map((card) => (
        <Card key={card.type}>
          <CardComponent type={card.type} volunteers={volunteers} />
        </Card>
      ))}
    </PageContainer>
  );
};

export default Profile;
