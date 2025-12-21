import React from "react";
import styled from "styled-components";
import { IconName, ProfileCardTypes } from "./types/types";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { VolunteerHeader } from "./sections/VolunteerHeader";
import { Card, SectionCard, SectionCardProps } from "./common/SectionCard";
import { Heading2 } from "@/components/styled/text";
import VolunteerOpportunities from "./sections/VolunteerOpportunities/VolunteerOpportunities";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--volunteer-profile-container-width);
  gap: var(--volunteer-profile-container-gap);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--volunteer-profile-back-link-gap);
  font-size: var(--volunteer-profile-back-link-font-size);
  color: var(--color-midnight);
  text-decoration: none;
  transition: var(--volunteer-profile-back-link-transition);
`;

interface ProfilePageProps {
  type?: ProfileCardTypes;
  volunteer: ApiVolunteerGet;
}

const ProfilePage = ({ volunteer }: ProfilePageProps) => {
  const { t } = useTranslation();

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.volunteerProfile.contactDetails"),
      headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
      subComponent: <div>Contact Details sub-component. to be replaced...</div>,
    },
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.volunteerProfile.volunteerProfile"),
      headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
      subComponent: <div>Volunteer Profile sub-component. to be replaced...</div>,
    },
    {
      iconName: IconName.ShootingStar,
      title: t("dashboard.volunteerProfile.opportunities"),
      headerButtonName: t("dashboard.volunteerProfile.findOppButtonName"),
      subComponent: <VolunteerOpportunities />,
    },
    {
      iconName: IconName.ChatCircleDots,
      title: t("dashboard.volunteerProfile.coordinatorComments"),
      subComponent: <div>Coordinator Comments sub-component. to be replaced...</div>,
    },
    {
      iconName: IconName.ClipboardText,
      title: t("dashboard.volunteerProfile.documents"),
      subComponent: <div>Documents sub-component. to be replaced...</div>,
    },
    {
      iconName: IconName.ChartLine,
      title: t("dashboard.volunteerProfile.activityLog"),
      subComponent: <div>Activity Log sub-component. to be replaced...</div>,
    },
  ];

  return (
    <PageContainer>
      <BackLink href="/dashboard">
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackLink>

      <Heading2>{t("dashboard.volunteerProfile.volunteersProfile")}</Heading2>

      <Card>
        <VolunteerHeader volunteer={volunteer} />
      </Card>

      {sections.map((s) => (
        <SectionCard key={s.title} {...s} />
      ))}
    </PageContainer>
  );
};

export default ProfilePage;
