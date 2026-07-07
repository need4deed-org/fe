import { useUpdateOpportunityType } from "@/hooks/useUpdateOpportunityType";
import { ApiOpportunityGet, OpportunityType } from "need4deed-sdk";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";

export type UseOpportunityTypeDialogReturn = UseStatusDialogReturn<OpportunityType>;

export const useOpportunityTypeDialog = (opportunity: ApiOpportunityGet): UseOpportunityTypeDialogReturn => {
  const { mutate: updateType } = useUpdateOpportunityType(opportunity.id);

  const onSave = (volunteerType: OpportunityType, { onSuccess }: { onSuccess: () => void }) => {
    updateType({ volunteerType }, { onSuccess });
  };

  return useStatusDialog({
    initial: opportunity.volunteerType as OpportunityType,
    onSave,
  });
};
