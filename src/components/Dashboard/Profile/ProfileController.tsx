import React from "react";
import { AgentProfileController } from "./AgentProfileController";
import { OpportunityProfileController } from "./OpportunityProfileController";
import { EntityType, ProfileNavigation } from "./types";
import { VolunteerProfileController } from "./VolunteerProfileController";
import { OrganizationProfileController } from "./OrganizationProfileController";

const CONTROLLER_MAP: Record<
  EntityType,
  React.ComponentType<{ entityId: string; profileNavigation?: ProfileNavigation }>
> = {
  volunteer: VolunteerProfileController,
  agent: AgentProfileController,
  opportunity: OpportunityProfileController,
  organization: OrganizationProfileController,
};

type Props = {
  entityId: string;
  entityType: EntityType;
  profileNavigation?: ProfileNavigation;
};

export const ProfileController = ({ entityId, entityType, profileNavigation }: Props) => {
  const EntityController = CONTROLLER_MAP[entityType];
  return <EntityController entityId={entityId} profileNavigation={profileNavigation} />;
};
