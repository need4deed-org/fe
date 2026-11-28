"use client";
import { ProfileController } from "./ProfileController";
import { EntityType, ProfileNavigation } from "./types/types";

interface ProfileLayoutProps {
  entityId: string;
  entityType: EntityType;
  profileNavigation?: ProfileNavigation;
}

export default function ProfileLayout({ entityId, entityType, profileNavigation }: ProfileLayoutProps) {
  return <ProfileController entityId={entityId} entityType={entityType} profileNavigation={profileNavigation} />;
}
