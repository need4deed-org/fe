import { Heading2 } from "@/components/styled/text";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { ApiOpportunityGet, ApiVolunteerGet, VolunteerStateTypeType } from "need4deed-sdk";
import Link from "next/link";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SectionCard, SectionCardProps } from "./common/SectionCard";
import { AccompanyingDetails } from "./sections/AccompanyingDetails";
import { Appreciation, AppreciationRef } from "./sections/Appreciation";
import { Comments } from "./sections/Comments";
import { CommunicationTracker, CommunicationTrackerRef } from "./sections/CommunicationTracker";
import { ContactDetails } from "./sections/ContactDetails";
import { ProfileHeader } from "./sections/ProfileHeader";
import { RefugeeAccommodationCentre } from "./sections/RefugeeAccommodationCentre";
import { EditableSectionRef } from "./sections/shared/types";
import VolunteerOpportunities from "./sections/VolunteerOpportunities/VolunteerOpportunities";
import { VolunteerProfile, VolunteerProfileRef } from "./sections/VolunteerProfile";
import { VolunteerProfileDocument } from "./sections/VolunteerProfileDocument";
import { IconName, ProfileEntityProps } from "./types/types";

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

const ProfilePage = ({ volunteer, opportunity, agent }: ProfileEntityProps) => {
  const { t, i18n } = useTranslation();
  const contactDetailsRef = useRef<EditableSectionRef>(null);
  const opportunityContactDetailsRef = useRef<EditableSectionRef>(null);
  const volunteerProfileRef = useRef<VolunteerProfileRef>(null);
  const communicationTrackerRef = useRef<CommunicationTrackerRef>(null);
  const appreciationRef = useRef<AppreciationRef>(null);
  const racRef = useRef<EditableSectionRef>(null);
  const accompanyingDetailsRef = useRef<EditableSectionRef>(null);

  const getVolunteerSections = (vol: ApiVolunteerGet): SectionCardProps[] => [
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.volunteerProfile.contactDetailsTitle"),
      headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
      onHeaderButtonClick: () => contactDetailsRef.current?.handleEditClick(),
      subComponent: <ContactDetails ref={contactDetailsRef} volunteer={vol} />,
    },
    {
      iconName: IconName.UserCircle,
      title: t("dashboard.volunteerProfile.volunteerProfile"),
      headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
      onHeaderButtonClick: () => volunteerProfileRef.current?.handleEditClick(),
      subComponent: <VolunteerProfile ref={volunteerProfileRef} volunteer={vol} />,
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
      subComponent: <CommunicationTracker ref={communicationTrackerRef} volunteer={vol} />,
    },
    {
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${vol.comments?.length ?? 0}`,
      subComponent: <Comments volunteer={vol} />,
    },
    {
      iconName: IconName.Gift,
      title: t("dashboard.appreciationSection.title"),
      headerButtonName: t("dashboard.appreciationSection.addNew"),
      onHeaderButtonClick: () => appreciationRef.current?.handleAddNew(),
      subComponent: <Appreciation ref={appreciationRef} volunteer={vol} />,
    },
    {
      iconName: IconName.ClipboardText,
      title: t("dashboard.volunteerProfile.documents"),
      subComponent: <VolunteerProfileDocument volunteer={vol} />,
    },
    {
      iconName: IconName.ChartLine,
      title: t("dashboard.volunteerProfile.activityLog"),
      subComponent: <div>Activity Log sub-component. to be replaced...</div>,
    },
  ];

  const getOpportunitySections = (opp: ApiOpportunityGet): SectionCardProps[] => {
    const commentsCount = opp.comments.length;
    const isAccompanyingType =
      opp.volunteerType === VolunteerStateTypeType.ACCOMPANYING ||
      opp.volunteerType === VolunteerStateTypeType.REGULAR_ACCOMPANYING;

    return [
      {
        iconName: IconName.ChatsCircle,
        title: t("dashboard.opportunityProfile.contactDetailsTitle"),
        headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
        onHeaderButtonClick: () => opportunityContactDetailsRef.current?.handleEditClick(),
        subComponent: <ContactDetails ref={opportunityContactDetailsRef} opportunity={opp} />,
      },
      {
        iconName: IconName.House,
        title: t("dashboard.opportunityProfile.racTitle"),
        headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
        onHeaderButtonClick: () => racRef.current?.handleEditClick(),
        subComponent: <RefugeeAccommodationCentre ref={racRef} opportunity={opp} />,
      },
      {
        iconName: IconName.Users,
        title: t("dashboard.opportunityProfile.accompanyingDetailsTitle"),
        ...(isAccompanyingType && {
          headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
          onHeaderButtonClick: () => accompanyingDetailsRef.current?.handleEditClick?.(),
        }),
        subComponent: <AccompanyingDetails ref={accompanyingDetailsRef} opportunity={opp} />,
      },
      {
        iconName: IconName.ChatCircleDots,
        title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${commentsCount}`,
        subComponent: <Comments opportunity={opp} />,
      },
    ];
  };

  const getAgentSections = (): SectionCardProps[] => [];

  const sections = volunteer
    ? getVolunteerSections(volunteer)
    : agent
      ? getAgentSections()
      : getOpportunitySections(opportunity);

  const getHeading = () => {
    if (volunteer) return t("dashboard.volunteerProfile.volunteersProfile");
    if (agent) return t("dashboard.agentProfile.agentProfile");
    return t("dashboard.opportunityProfile.opportunityProfile");
  };

  const renderHeader = () => {
    if (volunteer) return <ProfileHeader volunteer={volunteer} />;
    if (agent) return <ProfileHeader agent={agent} />;
    return <ProfileHeader opportunity={opportunity} />;
  };

  return (
    <PageContainer>
      <BackLink href={`/${i18n.language}/dashboard`}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackLink>

      <Heading2>{getHeading()}</Heading2>

      {renderHeader()}

      {sections.map((s) => (
        <SectionCard key={s.title} {...s} />
      ))}
    </PageContainer>
  );
};

export default ProfilePage;
