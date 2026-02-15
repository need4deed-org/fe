import { SectionCardProps } from "@/components/Dashboard/Profile/common/SectionCard";
import { Comments } from "@/components/Dashboard/Profile/sections/Comments";
import {
  CommunicationTracker,
  CommunicationTrackerRef,
} from "@/components/Dashboard/Profile/sections/CommunicationTracker";
import { OrganisationDetails } from "@/components/Dashboard/Profile/sections/OrganisationDetails";
import { ProfileHeader } from "@/components/Dashboard/Profile/sections/ProfileHeader";
import { EditableSectionRef } from "@/components/Dashboard/Profile/sections/shared/types";
import { ApiAgentProfileGet, IconName } from "@/components/Dashboard/Profile/types";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const useAgentProfileSections = (agent: ApiAgentProfileGet | undefined) => {
  const { t } = useTranslation();

  const organisationDetailsRef = useRef<EditableSectionRef>(null);
  const communicationTrackerRef = useRef<CommunicationTrackerRef>(null);

  const [isOrgEditing, setIsOrgEditing] = useState(false);

  const handleOrgEditingChange = useCallback((editing: boolean) => setIsOrgEditing(editing), []);

  if (!agent) return null;

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.UsersThree,
      title: t("dashboard.agentProfile.organisationDetails.title"),
      ...(!isOrgEditing && {
        headerButtonName: t("dashboard.agentProfile.organisationDetails.edit"),
        onHeaderButtonClick: () => organisationDetailsRef.current?.handleEditClick(),
      }),
      subComponent: (
        <OrganisationDetails ref={organisationDetailsRef} agent={agent} onEditingChange={handleOrgEditingChange} />
      ),
    },
    {
      iconName: IconName.ChatsTeardrop,
      title: t("dashboard.communicationSection.title"),
      headerButtonName: t("dashboard.communicationSection.addNew"),
      onHeaderButtonClick: () => communicationTrackerRef.current?.handleAddNew(),
      subComponent: <CommunicationTracker ref={communicationTrackerRef} entityId={agent.id} entityType="agent" />,
    },
    {
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${agent.comments?.length ?? 0}`,
      subComponent: <Comments agent={agent} />,
    },
  ];

  return {
    sections,
    heading: t("dashboard.agentProfile.agentProfile"),
    header: <ProfileHeader agent={agent} />,
  };
};
