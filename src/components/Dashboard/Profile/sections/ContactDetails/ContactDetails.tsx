"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types/types";
import { forwardRef } from "react";
import { OpportunityContactDetails } from "./opportunity";
import { ContactDetailsRef } from "./types";
import { VolunteerContactDetails } from "./volunteer";

export const ContactDetails = forwardRef<ContactDetailsRef, ProfileEntityProps>(function ContactDetails(props, ref) {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerContactDetails ref={ref} volunteer={props.volunteer} />;
  }

  return <OpportunityContactDetails ref={ref} opportunity={props.opportunity} />;
});
