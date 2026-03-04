import { SectionCardProps } from "@/components/Dashboard/Profile/common/SectionCard";
import { AccompanyingDetails } from "@/components/Dashboard/Profile/sections/AccompanyingDetails";
import { Comments } from "@/components/Dashboard/Profile/sections/Comments";
import { ContactDetails } from "@/components/Dashboard/Profile/sections/ContactDetails";
import { OpportunityDetails } from "@/components/Dashboard/Profile/sections/OpportunityDetails";
import { OpportunityVolunteers } from "@/components/Dashboard/Profile/sections/OpportunityVolunteers";
import { ProfileHeader } from "@/components/Dashboard/Profile/sections/ProfileHeader";
import { RefugeeAccommodationCentre } from "@/components/Dashboard/Profile/sections/RefugeeAccommodationCentre";
import { EditableSectionRef } from "@/components/Dashboard/Profile/sections/shared/types";
import { IconName } from "@/components/Dashboard/Profile/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ApiOpportunityGet, UserRole, VolunteerStateTypeType } from "need4deed-sdk";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const useOpportunityProfileSections = (opportunity: ApiOpportunityGet | undefined) => {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const opportunityContactDetailsRef = useRef<EditableSectionRef>(null);
  const racRef = useRef<EditableSectionRef>(null);
  const accompanyingDetailsRef = useRef<EditableSectionRef>(null);
  const opportunityDetailsRef = useRef<EditableSectionRef>(null);

  const [isOppDetailsEditing, setIsOppDetailsEditing] = useState(false);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isRacEditing, setIsRacEditing] = useState(false);
  const [isAccompanyingEditing, setIsAccompanyingEditing] = useState(false);

  const handleOppDetailsEditingChange = useCallback((editing: boolean) => setIsOppDetailsEditing(editing), []);
  const handleContactEditingChange = useCallback((editing: boolean) => setIsContactEditing(editing), []);
  const handleRacEditingChange = useCallback((editing: boolean) => setIsRacEditing(editing), []);
  const handleAccompanyingEditingChange = useCallback((editing: boolean) => setIsAccompanyingEditing(editing), []);

  if (!opportunity) return null;

  const canFindVolunteers = currentUser?.role === UserRole.COORDINATOR || currentUser?.role === UserRole.AGENT;

  const commentsCount = opportunity.comments.length;
  const isAccompanyingType =
    opportunity.volunteerType === VolunteerStateTypeType.ACCOMPANYING ||
    opportunity.volunteerType === VolunteerStateTypeType.REGULAR_ACCOMPANYING;

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.Wrench,
      title: t("dashboard.opportunityProfile.opportunityDetails.title"),
      ...(!isOppDetailsEditing && {
        headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
        onHeaderButtonClick: () => opportunityDetailsRef.current?.handleEditClick(),
      }),
      subComponent: (
        <OpportunityDetails
          ref={opportunityDetailsRef}
          opportunity={opportunity}
          onEditingChange={handleOppDetailsEditingChange}
        />
      ),
    },
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.opportunityProfile.contactDetailsTitle"),
      ...(!isContactEditing && {
        headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
        onHeaderButtonClick: () => opportunityContactDetailsRef.current?.handleEditClick(),
      }),
      subComponent: (
        <ContactDetails
          ref={opportunityContactDetailsRef}
          opportunity={opportunity}
          onEditingChange={handleContactEditingChange}
        />
      ),
    },
    {
      iconName: IconName.House,
      title: t("dashboard.opportunityProfile.racTitle"),
      ...(!isRacEditing && {
        headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
        onHeaderButtonClick: () => racRef.current?.handleEditClick(),
      }),
      subComponent: (
        <RefugeeAccommodationCentre ref={racRef} opportunity={opportunity} onEditingChange={handleRacEditingChange} />
      ),
    },
    {
      iconName: IconName.Users,
      title: t("dashboard.opportunityProfile.accompanyingDetailsTitle"),
      ...(isAccompanyingType &&
        !isAccompanyingEditing && {
          headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
          onHeaderButtonClick: () => accompanyingDetailsRef.current?.handleEditClick?.(),
        }),
      subComponent: (
        <AccompanyingDetails
          ref={accompanyingDetailsRef}
          opportunity={opportunity}
          onEditingChange={handleAccompanyingEditingChange}
        />
      ),
    },
    {
      iconName: IconName.UsersThree,
      title: t("dashboard.opportunityProfile.volunteersSec.title"),
      ...(canFindVolunteers && {
        headerButtonName: t("dashboard.opportunityProfile.volunteersSec.findVolunteers"),
        headerButtonDisabled: true,
      }),
      subComponent: <OpportunityVolunteers />,
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
