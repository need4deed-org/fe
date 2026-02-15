import { SectionCardProps } from "@/components/Dashboard/Profile/common/SectionCard";
import { Appreciation, AppreciationRef } from "@/components/Dashboard/Profile/sections/Appreciation";
import { Comments } from "@/components/Dashboard/Profile/sections/Comments";
import {
  CommunicationTracker,
  CommunicationTrackerRef,
} from "@/components/Dashboard/Profile/sections/CommunicationTracker";
import { ContactDetails } from "@/components/Dashboard/Profile/sections/ContactDetails";
import { ProfileHeader } from "@/components/Dashboard/Profile/sections/ProfileHeader";
import { EditableSectionRef } from "@/components/Dashboard/Profile/sections/shared/types";
import VolunteerOpportunities from "@/components/Dashboard/Profile/sections/VolunteerOpportunities/VolunteerOpportunities";
import { VolunteerProfile, VolunteerProfileRef } from "@/components/Dashboard/Profile/sections/VolunteerProfile";
import { VolunteerProfileDocument } from "@/components/Dashboard/Profile/sections/VolunteerProfileDocument";
import { IconName } from "@/components/Dashboard/Profile/types";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const useVolunteerProfileSections = (volunteer: ApiVolunteerGet | undefined) => {
  const { t } = useTranslation();

  const contactDetailsRef = useRef<EditableSectionRef>(null);
  const volunteerProfileRef = useRef<VolunteerProfileRef>(null);
  const communicationTrackerRef = useRef<CommunicationTrackerRef>(null);
  const appreciationRef = useRef<AppreciationRef>(null);

  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  const handleContactEditingChange = useCallback((editing: boolean) => setIsContactEditing(editing), []);
  const handleProfileEditingChange = useCallback((editing: boolean) => setIsProfileEditing(editing), []);

  if (!volunteer) return null;

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.volunteerProfile.contactDetailsTitle"),
      ...(!isContactEditing && {
        headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
        onHeaderButtonClick: () => contactDetailsRef.current?.handleEditClick(),
      }),
      subComponent: (
        <ContactDetails ref={contactDetailsRef} volunteer={volunteer} onEditingChange={handleContactEditingChange} />
      ),
    },
    {
      iconName: IconName.UserCircle,
      title: t("dashboard.volunteerProfile.volunteerProfile"),
      ...(!isProfileEditing && {
        headerButtonName: t("dashboard.volunteerProfile.editButtonName"),
        onHeaderButtonClick: () => volunteerProfileRef.current?.handleEditClick(),
      }),
      subComponent: (
        <VolunteerProfile
          ref={volunteerProfileRef}
          volunteer={volunteer}
          onEditingChange={handleProfileEditingChange}
        />
      ),
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
      subComponent: <CommunicationTracker ref={communicationTrackerRef} entityId={volunteer.id} entityType="volunteer" />,
    },
    {
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${volunteer.comments?.length ?? 0}`,
      subComponent: <Comments volunteer={volunteer} />,
    },
    {
      iconName: IconName.Gift,
      title: t("dashboard.appreciationSection.title"),
      headerButtonName: t("dashboard.appreciationSection.addNew"),
      onHeaderButtonClick: () => appreciationRef.current?.handleAddNew(),
      subComponent: <Appreciation ref={appreciationRef} volunteer={volunteer} />,
    },
    {
      iconName: IconName.ClipboardText,
      title: t("dashboard.volunteerProfile.documents"),
      subComponent: <VolunteerProfileDocument volunteer={volunteer} />,
    },
    {
      iconName: IconName.ChartLine,
      title: t("dashboard.volunteerProfile.activityLog"),
      subComponent: <div>Activity Log sub-component. to be replaced...</div>,
    },
  ];

  return {
    sections,
    heading: t("dashboard.volunteerProfile.volunteersProfile"),
    header: <ProfileHeader volunteer={volunteer} />,
  };
};
