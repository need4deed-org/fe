"use client";
import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { MultipleProfilesController } from "@/components/Dashboard/Profile/MultipleProfilesController";
import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { Paragraph } from "@/components/styled/text";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { UserRole } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const ProfileStateContainer = styled(CenteredWrapper)`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: auto;
  min-height: 60dvh;
  padding: var(--spacing-32) var(--spacing-16);
  text-align: center;

  p {
    max-width: 100%;
    overflow-wrap: anywhere;
  }
`;

const ProfilePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProfileState = ({ children }: { children: React.ReactNode }) => (
  <ProfileStateContainer>{children}</ProfileStateContainer>
);

export default function DashboardProfilePage() {
  return (
    <ProfilePageContainer>
      <ProfileContent />
    </ProfilePageContainer>
  );
}

function ProfileContent() {
  const { t } = useTranslation();
  const { agentId, agentIds, traegerId, volunteerId, userRole, isLoading } = useGetCurrentAgent();

  if (isLoading) {
    return (
      <ProfileState>
        <Paragraph>{t("dashboard.profile.loading")}</Paragraph>
      </ProfileState>
    );
  }

  if (userRole === UserRole.VOLUNTEER && !volunteerId) {
    return (
      <ProfileState>
        <Paragraph>{t("dashboard.profile.notVolProfSetUp")}</Paragraph>
      </ProfileState>
    );
  }

  if (!agentId && agentIds.length === 0 && !volunteerId) {
    return (
      <ProfileState>
        <Paragraph>{t("dashboard.profile.notSetUp")}</Paragraph>
      </ProfileState>
    );
  }

  if (volunteerId) {
    return <ProfileLayout entityId={String(volunteerId)} entityType={"volunteer"} />;
  }

  if (agentIds.length > 1) {
    return <MultipleProfilesController agentIds={agentIds} showList={Boolean(traegerId)} />;
  }

  if (agentId) {
    return <ProfileLayout entityId={String(agentId)} entityType={"agent"} />;
  }

  return (
    <ProfileState>
      <Paragraph>{t("dashboard.profile.notSetUp")}</Paragraph>
    </ProfileState>
  );
}
