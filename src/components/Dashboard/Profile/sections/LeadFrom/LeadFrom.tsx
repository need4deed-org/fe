import { ApiVolunteerGet } from "need4deed-sdk";
import React from "react";

type Props = {
  volunteer: ApiVolunteerGet;
};

export const LeadFrom = ({ volunteer }: Props) => {
  const lead = String(volunteer?.leadFrom) ?? "-";
  return <div>{lead}</div>;
};
