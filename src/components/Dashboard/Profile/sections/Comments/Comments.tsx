"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types/types";
import { AgentComments } from "./agent";
import { OpportunityComments } from "./opportunity";
import { VolunteerComments } from "./volunteer";

export const Comments = (props: ProfileEntityProps) => {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerComments volunteer={props.volunteer} />;
  }

  if ("opportunity" in props && props.opportunity) {
    return <OpportunityComments opportunity={props.opportunity} />;
  }

  if ("agent" in props && props.agent) {
    return <AgentComments agent={props.agent} />;
  }

  return null;
};
