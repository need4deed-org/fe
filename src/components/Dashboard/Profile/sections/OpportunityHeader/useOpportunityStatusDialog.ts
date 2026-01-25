import { useUpdateOpportunityStatus, OpportunityStatusUpdateData } from "@/hooks/useUpdateOpportunityStatus";
import { ApiOpportunityGet, OpportunityStatusType } from "need4deed-sdk";
import { useState, useMemo } from "react";

export type UseOpportunityStatusDialogReturn = {
  isOpen: boolean;
  statusOpportunity: OpportunityStatusType;
  originalStatus: OpportunityStatusType;
  isSaveDisabled: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  saveDialog: () => void;
  setStatusOpportunity: (status: OpportunityStatusType) => void;
};

export const useOpportunityStatusDialog = (opportunity: ApiOpportunityGet): UseOpportunityStatusDialogReturn => {
  const { mutate: updateStatus } = useUpdateOpportunityStatus(opportunity.id);

  const [isOpen, setIsOpen] = useState(false);
  const [statusOpportunity, setStatusOpportunity] = useState<OpportunityStatusType>(opportunity.statusOpportunity);

  const isSaveDisabled = useMemo(
    () => statusOpportunity === opportunity.statusOpportunity,
    [statusOpportunity, opportunity.statusOpportunity],
  );

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setStatusOpportunity(opportunity.statusOpportunity);
    setIsOpen(false);
  };

  const saveDialog = () => {
    const payload: OpportunityStatusUpdateData = {
      statusOpportunity,
    };

    updateStatus(payload, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return {
    isOpen,
    statusOpportunity,
    originalStatus: opportunity.statusOpportunity,
    isSaveDisabled,
    openDialog,
    closeDialog,
    saveDialog,
    setStatusOpportunity,
  };
};
