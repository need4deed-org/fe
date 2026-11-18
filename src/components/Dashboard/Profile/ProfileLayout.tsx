"use client";
import { ProfileController } from "./ProfileController";
import { EntityType, ProfileNavigationDirection } from "./types/types";

interface ProfileLayoutProps {
  entityId: string;
  entityType: EntityType;
  handleProfileNavigation?: (direction: ProfileNavigationDirection) => void;
}

export default function ProfileLayout({ entityId, entityType, handleProfileNavigation }: ProfileLayoutProps) {
  return (
    <ProfileController entityId={entityId} entityType={entityType} handleProfileNavigation={handleProfileNavigation} />
  );
}
