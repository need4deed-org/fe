"use client";
import React from "react";
import { UserRole } from "need4deed-sdk";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardContentContainer } from "./styles";
import { AgentHomeContent } from "./agent";
import { CoordinatorHomeContent } from "./coordinator";
import { VolunteerHomeContent } from "./volunteer";
import { HomeSkeleton } from "./HomeSkeleton";

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

  return (
    <DashboardContentContainer>
      <DashboardContentController volunteerId={user?.volunteerId} />
    </DashboardContentContainer>
  );
}
