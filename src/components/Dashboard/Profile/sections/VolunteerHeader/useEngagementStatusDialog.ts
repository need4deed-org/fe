import { useUpdateVolunteerStatus, VolunteerStatusUpdateData } from "@/hooks/useUpdateVolunteerStatus";
import { ApiVolunteerGet, VolunteerStateEngagementType } from "need4deed-sdk";
import { useState, useCallback, useMemo } from "react";

type UseEngagementStatusDialogReturn = {
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

  const getInitialDate = useCallback(
    (): Date | undefined => (volunteer.dateReturn ? new Date(volunteer.dateReturn) : undefined),
    [volunteer.dateReturn],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [statusEngagement, setStatusEngagement] = useState<VolunteerStateEngagementType>(volunteer.statusEngagement);
  const [dateReturn, setDateReturn] = useState<Date | undefined>(getInitialDate());
  const [initialDateReturn, setInitialDateReturn] = useState<Date | undefined>(getInitialDate());

  const isSaveDisabled = useMemo(
    () =>
      statusEngagement === volunteer.statusEngagement &&
      (statusEngagement !== VolunteerStateEngagementType.TEMP_UNAVAILABLE ||
        dateReturn?.getTime() === initialDateReturn?.getTime()),
    [statusEngagement, volunteer.statusEngagement, dateReturn, initialDateReturn],
  );

  const openDialog = useCallback(() => {
    setIsOpen(true);
    const initialDate = getInitialDate();
    setDateReturn(initialDate);
    setInitialDateReturn(initialDate);
  }, [getInitialDate]);

  const closeDialog = useCallback(() => {
    setStatusEngagement(volunteer.statusEngagement);
    const initialDate = getInitialDate();
    setDateReturn(initialDate);
    setInitialDateReturn(initialDate);
    setIsOpen(false);
  }, [volunteer.statusEngagement, getInitialDate]);

  const saveDialog = useCallback(() => {
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
  }, [statusEngagement, dateReturn, updateStatus]);

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
