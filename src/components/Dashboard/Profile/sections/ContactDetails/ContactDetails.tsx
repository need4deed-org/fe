"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types";
import { forwardRef } from "react";
import { EditableSectionRef } from "../shared/types";
import { OpportunityContactDetails } from "./opportunity";
import { VolunteerContactDetails } from "./volunteer";
import { AgentContactDetails } from "./agent";

export const ContactDetails = forwardRef<EditableSectionRef, ProfileEntityProps>(function ContactDetails(props, ref) {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerContactDetails ref={ref} volunteer={props.volunteer} />;
  }

  if ("opportunity" in props && props.opportunity) {
    return <OpportunityContactDetails ref={ref} opportunity={props.opportunity} />;
  }

  if ("agent" in props && props.agent) {
    return <AgentContactDetails ref={ref} agent={props.agent} />;
  }

  return null;
});
