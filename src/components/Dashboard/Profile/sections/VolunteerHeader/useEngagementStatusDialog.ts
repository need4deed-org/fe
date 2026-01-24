import { useUpdateVolunteerStatus, VolunteerStatusUpdateData } from "@/hooks/useUpdateVolunteerStatus";
import { ApiVolunteerGet, VolunteerStateEngagementType } from "need4deed-sdk";
import { useState, useMemo } from "react";

export type UseEngagementStatusDialogReturn = {
  isOpen: boolean;
  statusEngagement: VolunteerStateEngagementType;
  dateReturn: Date | undefined;
  originalStatus: VolunteerStateEngagementType;
  isSaveDisabled: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  saveDialog: () => void;
  setStatusEngagement: (status: VolunteerStateEngagementType) => void;
  setDateReturn: (date: Date | undefined) => void;
};

export const useEngagementStatusDialog = (volunteer: ApiVolunteerGet): UseEngagementStatusDialogReturn => {
  const { mutate: updateStatus } = useUpdateVolunteerStatus(volunteer.id);

  const initialDate = volunteer.dateReturn ? new Date(volunteer.dateReturn) : undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [statusEngagement, setStatusEngagement] = useState<VolunteerStateEngagementType>(volunteer.statusEngagement);
  const [dateReturn, setDateReturn] = useState<Date | undefined>(initialDate);
  const [initialDateReturn, setInitialDateReturn] = useState<Date | undefined>(initialDate);

  const isSaveDisabled = useMemo(
    () =>
      statusEngagement === volunteer.statusEngagement &&
      (statusEngagement !== VolunteerStateEngagementType.TEMP_UNAVAILABLE ||
        dateReturn?.getTime() === initialDateReturn?.getTime()),
    [statusEngagement, volunteer.statusEngagement, dateReturn, initialDateReturn],
  );

  const openDialog = () => {
    setIsOpen(true);
    setDateReturn(initialDate);
    setInitialDateReturn(initialDate);
  };
  const closeDialog = () => {
    setStatusEngagement(volunteer.statusEngagement);
    setDateReturn(initialDate);
    setInitialDateReturn(initialDate);
    setIsOpen(false);
  };

  const saveDialog = () => {
    const isTempUnavailable = statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE;

    const payload: VolunteerStatusUpdateData = {
      statusEngagement,
    };

    if (statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && dateReturn) {
      payload.dateReturn = dateReturn.toISOString();
    }

    updateStatus(payload, {
      onSuccess: () => {
        if (isTempUnavailable && dateReturn) {
          setInitialDateReturn(dateReturn);
        }
        setIsOpen(false);
      },
    });
  };

  return {
    isOpen,
    statusEngagement,
    dateReturn,
    originalStatus: volunteer.statusEngagement,
    isSaveDisabled,
    openDialog,
    closeDialog,
    saveDialog,
    setStatusEngagement,
    setDateReturn,
  };
};
