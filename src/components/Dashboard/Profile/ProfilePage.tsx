import { Heading2 } from "@/components/styled/text";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { ApiOpportunityGet, ApiVolunteerGet } from "need4deed-sdk";
import Link from "next/link";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SectionCard, SectionCardProps } from "./common/SectionCard";
import { ProfileEntityType } from "./ProfileLayout";
import { AppreciationSection, AppreciationSectionRef } from "./sections/AppreciationSection";
import { CommentsSection } from "./sections/CommentsSection";
import { CommunicationTrackerSection, CommunicationTrackerSectionRef } from "./sections/CommunicationTrackerSection";
import { ContactDetails, ContactDetailsRef } from "./sections/ContactDetails";
import { OpportunityHeader } from "./sections/OpportunityHeader";
import { ProfileHeader } from "./sections/ProfileHeader";
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
  data: ApiVolunteerGet | ApiOpportunityGet;
  entityType: ProfileEntityType;
}

const ProfilePage = ({ data, entityType }: ProfilePageProps) => {
  const { t, i18n } = useTranslation();
  const contactDetailsRef = useRef<ContactDetailsRef>(null);
  const volunteerProfileRef = useRef<VolunteerProfileSectionRef>(null);
  const communicationTrackerRef = useRef<CommunicationTrackerSectionRef>(null);
  const appreciationSectionRef = useRef<AppreciationSectionRef>(null);

  // Type guards
  const isVolunteer = entityType === "volunteer";
  const volunteer = isVolunteer ? (data as ApiVolunteerGet) : undefined;
  const opportunity = !isVolunteer ? (data as ApiOpportunityGet) : undefined;

  // Sections for volunteer profile
  const volunteerSections: SectionCardProps[] = [
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.volunteerProfile.contactDetailsTitle"),
      headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
      onHeaderButtonClick: () => contactDetailsRef.current?.handleEditClick(),
      subComponent: volunteer ? <ContactDetails ref={contactDetailsRef} volunteer={volunteer} /> : null,
    },
    {
      iconName: IconName.UserCircle,
      title: t("dashboard.volunteerProfile.volunteerProfile"),
      headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
      onHeaderButtonClick: () => volunteerProfileRef.current?.handleEditClick(),
      subComponent: volunteer ? <VolunteerProfileSection ref={volunteerProfileRef} volunteer={volunteer} /> : null,
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
      headerButtonName: t("dashboard.communicationSection.addNew"),
      onHeaderButtonClick: () => communicationTrackerRef.current?.handleAddNew(),
      subComponent: volunteer ? (
        <CommunicationTrackerSection ref={communicationTrackerRef} volunteer={volunteer} />
      ) : null,
    },
    {
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${volunteer?.comments?.length ?? 0}`,
      subComponent: volunteer ? <CommentsSection volunteer={volunteer} /> : null,
    },
    {
      iconName: IconName.Gift,
      title: t("dashboard.appreciationSection.title"),
      headerButtonName: t("dashboard.appreciationSection.addNew"),
      onHeaderButtonClick: () => appreciationSectionRef.current?.handleAddNew(),
      subComponent: volunteer ? <AppreciationSection ref={appreciationSectionRef} volunteer={volunteer} /> : null,
    },
    {
      iconName: IconName.ClipboardText,
      title: t("dashboard.volunteerProfile.documents"),
      subComponent: volunteer ? <VolunteerProfileDocumentSection volunteer={volunteer} /> : null,
    },
    {
      iconName: IconName.ChartLine,
      title: t("dashboard.volunteerProfile.activityLog"),
      subComponent: <div>Activity Log sub-component. to be replaced...</div>,
    },
  ];

  // Sections for opportunity profile - initially showing just basic info
  // More sections will be added later
  const opportunitySections: SectionCardProps[] = [
    // Placeholder for future sections
  ];

  const sections = isVolunteer ? volunteerSections : opportunitySections;

  return (
    <PageContainer>
      <BackLink href={`/${i18n.language}/dashboard`}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackLink>

      <Heading2>
        {isVolunteer
          ? t("dashboard.volunteerProfile.volunteersProfile")
          : t("dashboard.opportunityProfile.opportunityProfile")}
      </Heading2>

      <ProfileHeader>
        {isVolunteer && volunteer ? (
          <VolunteerHeader volunteer={volunteer} />
        ) : opportunity ? (
          <OpportunityHeader opportunity={opportunity} />
        ) : null}
      </ProfileHeader>

      {sections.map((s) => (
        <SectionCard key={s.title} {...s} />
      ))}
    </PageContainer>
  );
};

export default ProfilePage;
