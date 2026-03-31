"use client";
import { ApiOpportunityGet } from "need4deed-sdk";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormContainer } from "../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { useEditingChangeNotifier } from "../shared/useEditingChangeNotifier";
import { OpportunityDetailsDisplay } from "./OpportunityDetailsDisplay";
import { OpportunityDetailsEdit } from "./OpportunityDetailsEdit";

type Props = {
  opportunity: ApiOpportunityGet;
} & EditableSectionProps;

export const OpportunityDetails = forwardRef<EditableSectionRef, Props>(function OpportunityDetails(
  { opportunity, onEditingChange },
  ref,
) {
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

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
