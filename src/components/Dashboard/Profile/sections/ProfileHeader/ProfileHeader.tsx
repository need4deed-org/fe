"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types";
import { AgentHeader } from "./agent";
import { OpportunityHeader } from "./opportunity";
import { VolunteerHeader } from "./volunteer";
import { OrganizationHeader } from "./organization";

export const ProfileHeader = (props: ProfileEntityProps) => {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerHeader volunteer={props.volunteer} />;
  }

  if ("agent" in props && props.agent) {
    return <AgentHeader agent={props.agent} />;
  }

  if ("organization" in props && props.organization) {
    return <OrganizationHeader organization={props.organization} />;
  }

  return <OpportunityHeader opportunity={props.opportunity} />;
};
