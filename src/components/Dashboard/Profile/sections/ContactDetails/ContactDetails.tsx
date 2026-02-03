"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types/types";
import { forwardRef } from "react";
import { EditableSectionRef } from "../shared/types";
import { OpportunityContactDetails } from "./opportunity";
import { VolunteerContactDetails } from "./volunteer";

export const ContactDetails = forwardRef<EditableSectionRef, ProfileEntityProps>(function ContactDetails(props, ref) {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerContactDetails ref={ref} volunteer={props.volunteer} />;
  }

  return <OpportunityContactDetails ref={ref} opportunity={props.opportunity} />;
});
