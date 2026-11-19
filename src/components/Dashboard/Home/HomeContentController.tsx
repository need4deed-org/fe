"use client";
import React from "react";
import { UserRole } from "need4deed-sdk";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardContentContainer } from "./styles";
import { AgentHomeContent } from "./agent";
import { CoordinatorHomeContent } from "./coordinator";
import { VolunteerHomeContent } from "./volunteer";
import { HomeSkeleton } from "./HomeSkeleton";
import { LinkButton } from "@/components/fields/LinkButton";
import { routes } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export type DashboardControllerProps = {
  volunteerId?: number;
};

const DASHBOARD_CONTROLLER_MAP: Partial<Record<UserRole, React.ComponentType<DashboardControllerProps>>> = {
  [UserRole.AGENT]: AgentHomeContent,
  [UserRole.COORDINATOR]: CoordinatorHomeContent,
  [UserRole.ADMIN]: CoordinatorHomeContent,
  [UserRole.VOLUNTEER]: VolunteerHomeContent,
};

export default function HomeContentController() {
  const user = useCurrentUser(true);
  const DashboardContentController = (user?.role && DASHBOARD_CONTROLLER_MAP[user.role]) || HomeSkeleton;
  const {
    t,
    i18n: { language },
  } = useTranslation();

  if (!user) return;

  return (
    <DashboardContentContainer>
      <ButtonContainer>
        {[UserRole.COORDINATOR, UserRole.ADMIN].includes(user.role) && (
          <LinkButton inline href={routes.statistics(language)} label={t("dashboard.home.statistics")} />
        )}
      </ButtonContainer>
      <DashboardContentController volunteerId={user?.volunteerId} />
    </DashboardContentContainer>
  );
}

const ButtonContainer = styled.div`
  display: -webkit-flex;
  display: flex;
  gap: var(--small-spacing);
  flex-wrap: wrap;
`;
