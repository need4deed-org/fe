import { SectionCardProps } from "@/components/Dashboard/Profile/common/SectionCard";
import { ContactDetails } from "@/components/Dashboard/Profile/sections/ContactDetails";
import { OrganizationAgents } from "@/components/Dashboard/Profile/sections/OrganizationAgents";
import { OrganizationDetails } from "@/components/Dashboard/Profile/sections/OrganizationDetails";
import { ProfileHeader } from "@/components/Dashboard/Profile/sections/ProfileHeader";
import { EditableSectionRef } from "@/components/Dashboard/Profile/sections/shared/types";
import { IconName } from "@/components/Dashboard/Profile/types/types";
import { ApiOrganizationGet } from "need4deed-sdk";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./useAuth";

export const useOrganizationProfileSections = (organization: ApiOrganizationGet | undefined) => {
  const { t } = useTranslation();
  const { isAuthorized } = useAuth();

  const contactDetailsRef = useRef<EditableSectionRef>(null);
  const organizationDetailsRef = useRef<EditableSectionRef>(null);

  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isOrgEditing, setIsOrgEditing] = useState(false);

  const handleContactEditingChange = useCallback((editing: boolean) => setIsContactEditing(editing), []);
  const handleOrgEditingChange = useCallback((editing: boolean) => setIsOrgEditing(editing), []);

  if (!organization) return null;

  const agents = organization.agents ?? [];

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.organizationProfile.contactDetails.title"),
      ...(!isContactEditing &&
        isAuthorized && {
          headerButtonName: t("dashboard.organizationProfile.contactDetails.edit"),
          onHeaderButtonClick: () => contactDetailsRef.current?.handleEditClick(),
        }),
      subComponent: (
        <ContactDetails
          ref={contactDetailsRef}
          organization={organization}
          onEditingChange={handleContactEditingChange}
        />
      ),
    },
    {
      iconName: IconName.UsersThree,
      title: t("dashboard.organizationProfile.organisationDetails.title"),
      ...(!isOrgEditing &&
        isAuthorized && {
          headerButtonName: t("dashboard.organizationProfile.organisationDetails.edit"),
          onHeaderButtonClick: () => organizationDetailsRef.current?.handleEditClick(),
        }),
      subComponent: (
        <OrganizationDetails
          ref={organizationDetailsRef}
          organization={organization}
          onEditingChange={handleOrgEditingChange}
        />
      ),
    },
    {
      iconName: IconName.House,
      title: `${t("dashboard.organizationProfile.agents.title")} • ${agents.length}`,
      subComponent: <OrganizationAgents agents={agents} />,
    },
  ];

  return {
    sections,
    heading: t("dashboard.organizationProfile.title"),
    header: <ProfileHeader organization={organization} />,
  };
};
