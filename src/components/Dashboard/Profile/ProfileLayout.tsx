"use client";
import { DashboardLayout } from "@/components/Layout";
import { ProfileController } from "./ProfileController";

export type ProfileEntityType = "volunteer" | "opportunity" | "agent";

interface ProfileLayoutProps {
  entityId: string;
  entityType: ProfileEntityType;
}

export default function ProfileLayout({ entityId, entityType }: ProfileLayoutProps) {
  const backgroundColor = "var(--layout-static-page-background-default)";
  return (
    <DashboardLayout background={backgroundColor}>
      <ProfileController entityId={entityId} entityType={entityType} />
    </DashboardLayout>
  );
}
