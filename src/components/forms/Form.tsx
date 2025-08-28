import React from "react";
import AddOpportunity from "./AddOpportunity/AddOpportunity";
import BecomeVolunteer from "./BecomeVolunteer";
import { FormType } from "./types";

interface Props {
  form: FormType;
}

export default function Form({ form }: Props) {
  switch (form) {
    case FormType.VOLUNTEER:
      return <BecomeVolunteer />;
    case FormType.OPPORTUNITY:
      return <AddOpportunity />;
    default:
      return null;
  }
}
