"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types/types";
import { OpportunityHeader } from "./opportunity";
import { VolunteerHeader } from "./volunteer";

export const ProfileHeader = (props: ProfileEntityProps) => {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerHeader volunteer={props.volunteer} />;
  }

  return <OpportunityHeader opportunity={props.opportunity} />;
};
