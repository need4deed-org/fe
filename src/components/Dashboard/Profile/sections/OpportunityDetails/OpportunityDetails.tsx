"use client";
import { ApiOpportunityGet } from "need4deed-sdk";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormContainer } from "../shared/styles";
import { EditableSectionRef } from "../shared/types";
import { OpportunityDetailsDisplay } from "./OpportunityDetailsDisplay";
import { OpportunityDetailsEdit } from "./OpportunityDetailsEdit";

type Props = {
  opportunity: ApiOpportunityGet;
};

export const OpportunityDetails = forwardRef<EditableSectionRef, Props>(function OpportunityDetails(
  { opportunity },
  ref,
) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  useImperativeHandle(ref, () => ({ handleEditClick }));

  return (
    <FormContainer data-testid="opportunity-details" $isEditing={isEditing}>
      {isEditing ? (
        <OpportunityDetailsEdit opportunity={opportunity} onCancel={handleCancel} />
      ) : (
        <OpportunityDetailsDisplay opportunity={opportunity} />
      )}
    </FormContainer>
  );
});
