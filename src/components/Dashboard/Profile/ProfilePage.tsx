import { Heading2 } from "@/components/styled/text";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import Link from "next/link";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Card, SectionCard, SectionCardProps } from "./common/SectionCard";
import { AppreciationSection, AppreciationSectionRef } from "./sections/AppreciationSection";
import { CommentsSection } from "./sections/CommentsSection";
import { CommunicationTrackerSection } from "./sections/CommunicationTrackerSection";
import { ContactDetails, ContactDetailsRef } from "./sections/ContactDetails";
import { VolunteerHeader } from "./sections/VolunteerHeader";
import VolunteerOpportunities from "./sections/VolunteerOpportunities/VolunteerOpportunities";
import { VolunteerProfileDocumentSection } from "./sections/VolunteerProfileDocumentSection";
import { VolunteerProfileSection, VolunteerProfileSectionRef } from "./sections/VolunteerProfileSection";
import { IconName, ProfileCardTypes } from "./types/types";

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
  const contactDetailsRef = useRef<ContactDetailsRef>(null);
  const volunteerProfileRef = useRef<VolunteerProfileSectionRef>(null);
  const appreciationSectionRef = useRef<AppreciationSectionRef>(null);

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.volunteerProfile.contactDetailsTitle"),
      headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
      onHeaderButtonClick: () => contactDetailsRef.current?.handleEditClick(),
      subComponent: <ContactDetails ref={contactDetailsRef} volunteer={volunteer} />,
    },
    {
      iconName: IconName.UserCircle,
      title: t("dashboard.volunteerProfile.volunteerProfile"),
      headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
      onHeaderButtonClick: () => volunteerProfileRef.current?.handleEditClick(),
      subComponent: <VolunteerProfileSection ref={volunteerProfileRef} volunteer={volunteer} />,
    },
    {
      iconName: IconName.ShootingStar,
      title: t("dashboard.volunteerProfile.opportunities"),
      headerButtonName: t("dashboard.volunteerProfile.findOppButtonName"),
      subComponent: <VolunteerOpportunities />,
    },
    {
      iconName: IconName.ChatsTeardrop,
      title: t("dashboard.communicationSection.title"),
      subComponent: <CommunicationTrackerSection volunteer={volunteer} />,
    },
    {
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${volunteer.comments?.length ?? 0}`,
      subComponent: <CommentsSection volunteer={volunteer} />,
    },
    {
      iconName: IconName.Gift,
      title: t("dashboard.appreciationSection.title"),
      headerButtonName: t("dashboard.appreciationSection.addNew"),
      onHeaderButtonClick: () => appreciationSectionRef.current?.handleAddNew(),
      subComponent: <AppreciationSection ref={appreciationSectionRef} volunteer={volunteer} />,
    },
    {
      iconName: IconName.ClipboardText,
      title: t("dashboard.volunteerProfile.documents"),
      subComponent: <VolunteerProfileDocumentSection volunteer={volunteer} />,
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
