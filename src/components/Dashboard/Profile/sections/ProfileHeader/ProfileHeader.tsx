"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types";
import { AgentHeader } from "./agent";
import { OpportunityHeader } from "./opportunity";
import { VolunteerHeader } from "./volunteer";

export const ProfileHeader = (props: ProfileEntityProps) => {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerHeader volunteer={props.volunteer} />;
  }

  if ("agent" in props && props.agent) {
    return <AgentHeader agent={props.agent} />;
  }

  return <OpportunityHeader opportunity={props.opportunity} />;
};
