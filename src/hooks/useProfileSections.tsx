import { SectionCardProps } from "@/components/Dashboard/Profile/common/SectionCard";
import { AccompanyingDetails } from "@/components/Dashboard/Profile/sections/AccompanyingDetails";
import { Appreciation, AppreciationRef } from "@/components/Dashboard/Profile/sections/Appreciation";
import { Comments } from "@/components/Dashboard/Profile/sections/Comments";
import {
  CommunicationTracker,
  CommunicationTrackerRef,
} from "@/components/Dashboard/Profile/sections/CommunicationTracker";
import { ContactDetails } from "@/components/Dashboard/Profile/sections/ContactDetails";
import { ProfileHeader } from "@/components/Dashboard/Profile/sections/ProfileHeader";
import { RefugeeAccommodationCentre } from "@/components/Dashboard/Profile/sections/RefugeeAccommodationCentre";
import { EditableSectionRef } from "@/components/Dashboard/Profile/sections/shared/types";
import VolunteerOpportunities from "@/components/Dashboard/Profile/sections/VolunteerOpportunities/VolunteerOpportunities";
import { VolunteerProfile, VolunteerProfileRef } from "@/components/Dashboard/Profile/sections/VolunteerProfile";
import { VolunteerProfileDocument } from "@/components/Dashboard/Profile/sections/VolunteerProfileDocument";
import { IconName, ProfileEntityProps } from "@/components/Dashboard/Profile/types/types";
import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types/agent";
import { ApiOpportunityGet, ApiVolunteerGet, VolunteerStateTypeType } from "need4deed-sdk";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export const useProfileSections = ({ volunteer, opportunity, agent }: ProfileEntityProps) => {
  const { t } = useTranslation();

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

  const getAgentSections = (ag: ApiAgentProfileGet): SectionCardProps[] => [
    {
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${ag.comments?.length ?? 0}`,
      subComponent: <Comments agent={ag} />,
    },
  ];

  const getSections = () => {
    if (volunteer) return getVolunteerSections(volunteer);
    if (agent) return getAgentSections(agent);
    if (opportunity) return getOpportunitySections(opportunity);
    return [];
  };

  const getHeading = () => {
    if (volunteer) return t("dashboard.volunteerProfile.volunteersProfile");
    if (agent) return t("dashboard.agentProfile.agentProfile");
    return t("dashboard.opportunityProfile.opportunityProfile");
  };

  const renderHeader = () => {
    if (volunteer) return <ProfileHeader volunteer={volunteer} />;
    if (agent) return <ProfileHeader agent={agent} />;
    if (opportunity) return <ProfileHeader opportunity={opportunity} />;
    return null;
  };

  return { sections: getSections(), heading: getHeading(), header: renderHeader() };
};
