import { SectionCardProps } from "@/components/Dashboard/Profile/common/SectionCard";
import { AccompanyingDetails } from "@/components/Dashboard/Profile/sections/AccompanyingDetails";
import { Comments } from "@/components/Dashboard/Profile/sections/Comments";
import { ContactDetails } from "@/components/Dashboard/Profile/sections/ContactDetails";
import { OpportunityDetails } from "@/components/Dashboard/Profile/sections/OpportunityDetails";
import { ProfileHeader } from "@/components/Dashboard/Profile/sections/ProfileHeader";
import { RefugeeAccommodationCentre } from "@/components/Dashboard/Profile/sections/RefugeeAccommodationCentre";
import { EditableSectionRef } from "@/components/Dashboard/Profile/sections/shared/types";
import { IconName } from "@/components/Dashboard/Profile/types";
import { ApiOpportunityGet, VolunteerStateTypeType } from "need4deed-sdk";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export const useOpportunityProfileSections = (opportunity: ApiOpportunityGet | undefined) => {
  const { t } = useTranslation();

  const opportunityContactDetailsRef = useRef<EditableSectionRef>(null);
  const racRef = useRef<EditableSectionRef>(null);
  const accompanyingDetailsRef = useRef<EditableSectionRef>(null);
  const opportunityDetailsRef = useRef<EditableSectionRef>(null);

  if (!opportunity) return null;

  const commentsCount = opportunity.comments.length;
  const isAccompanyingType =
    opportunity.volunteerType === VolunteerStateTypeType.ACCOMPANYING ||
    opportunity.volunteerType === VolunteerStateTypeType.REGULAR_ACCOMPANYING;

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.Wrench,
      title: t("dashboard.opportunityProfile.opportunityDetails.title"),
      headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
      onHeaderButtonClick: () => opportunityDetailsRef.current?.handleEditClick(),
      subComponent: <OpportunityDetails ref={opportunityDetailsRef} opportunity={opportunity} />,
    },
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.opportunityProfile.contactDetailsTitle"),
      headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
      onHeaderButtonClick: () => opportunityContactDetailsRef.current?.handleEditClick(),
      subComponent: <ContactDetails ref={opportunityContactDetailsRef} opportunity={opportunity} />,
    },
    {
      iconName: IconName.House,
      title: t("dashboard.opportunityProfile.racTitle"),
      headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
      onHeaderButtonClick: () => racRef.current?.handleEditClick(),
      subComponent: <RefugeeAccommodationCentre ref={racRef} opportunity={opportunity} />,
    },
    {
      iconName: IconName.Users,
      title: t("dashboard.opportunityProfile.accompanyingDetailsTitle"),
      ...(isAccompanyingType && {
        headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
        onHeaderButtonClick: () => accompanyingDetailsRef.current?.handleEditClick?.(),
      }),
      subComponent: <AccompanyingDetails ref={accompanyingDetailsRef} opportunity={opportunity} />,
    },
    {
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${commentsCount}`,
      subComponent: <Comments opportunity={opportunity} />,
    },
  ];

  return {
    sections,
    heading: t("dashboard.opportunityProfile.opportunityProfile"),
    header: <ProfileHeader opportunity={opportunity} />,
  };
};
