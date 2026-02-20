"use client";
import { ProfileEntityProps } from "@/components/Dashboard/Profile/types";
import { forwardRef } from "react";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { AgentContactDetails } from "./agent";
import { OpportunityContactDetails } from "./opportunity";
import { VolunteerContactDetails } from "./volunteer";

type Props = ProfileEntityProps & EditableSectionProps;

export const ContactDetails = forwardRef<EditableSectionRef, Props>(function ContactDetails(
  { onEditingChange, ...props },
  ref,
) {
  if ("volunteer" in props && props.volunteer) {
    return <VolunteerContactDetails ref={ref} volunteer={props.volunteer} onEditingChange={onEditingChange} />;
  }

  if ("opportunity" in props && props.opportunity) {
    return <OpportunityContactDetails ref={ref} opportunity={props.opportunity} onEditingChange={onEditingChange} />;
  }

  if ("agent" in props && props.agent) {
    return <AgentContactDetails ref={ref} agent={props.agent} onEditingChange={onEditingChange} />;
  }

  return null;
});
