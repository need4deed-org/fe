"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types/types";
import { OpportunityComments } from "./opportunity";
import { VolunteerComments } from "./volunteer";

export const Comments = (props: ProfileEntityProps) => {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerComments volunteer={props.volunteer} />;
  }

  return <OpportunityComments opportunity={props.opportunity} />;
};
