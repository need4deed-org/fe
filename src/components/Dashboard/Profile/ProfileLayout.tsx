"use client";
import { DashboardLayout } from "@/components/Layout";
import { ProfileController } from "./ProfileController";
import { EntityType, ProfileNavigation } from "./types/types";

interface ProfileLayoutProps {
  entityId: string;
  entityType: EntityType;
  profileNavigation?: ProfileNavigation;
}

export default function ProfileLayout({ entityId, entityType, profileNavigation }: ProfileLayoutProps) {
  const backgroundColor = "var(--layout-static-page-background-default)";
  return (
    <DashboardLayout background={backgroundColor}>
      <ProfileController entityId={entityId} entityType={entityType} profileNavigation={profileNavigation} />
    </DashboardLayout>
  );
}
