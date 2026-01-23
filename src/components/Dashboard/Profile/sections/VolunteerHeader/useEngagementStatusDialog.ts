import { useUpdateVolunteerStatus } from "@/hooks/useUpdateVolunteerStatus";
import { ApiVolunteerGet, VolunteerStateEngagementType } from "need4deed-sdk";
import { useState, useCallback, useMemo } from "react";

type UseEngagementStatusDialogReturn = {
  isOpen: boolean;
  statusEngagement: VolunteerStateEngagementType;
  returnDate: Date | undefined;
  originalStatus: VolunteerStateEngagementType;
  isSaveDisabled: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  saveDialog: () => void;
  setStatusEngagement: (status: VolunteerStateEngagementType) => void;
  setReturnDate: (date: Date | undefined) => void;
};

export const useEngagementStatusDialog = (
  volunteer: ApiVolunteerGet,
): UseEngagementStatusDialogReturn => {
  const { mutate: updateStatus } = useUpdateVolunteerStatus(volunteer.id);

  const getInitialDate = useCallback(
    (): Date | undefined =>
      volunteer.returnDate
        ? new Date(volunteer.returnDate)
        : volunteer.updatedAt
          ? new Date(volunteer.updatedAt)
          : undefined,
    [volunteer.returnDate, volunteer.updatedAt],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [statusEngagement, setStatusEngagement] = useState<VolunteerStateEngagementType>(
    volunteer.statusEngagement,
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(getInitialDate());
  const [initialReturnDate, setInitialReturnDate] = useState<Date | undefined>(getInitialDate());

  const isSaveDisabled = useMemo(
    () =>
      statusEngagement === volunteer.statusEngagement &&
      (statusEngagement !== VolunteerStateEngagementType.TEMP_UNAVAILABLE ||
        returnDate?.getTime() === initialReturnDate?.getTime()),
    [statusEngagement, volunteer.statusEngagement, returnDate, initialReturnDate],
  );

  const openDialog = useCallback(() => {
    setIsOpen(true);
    const initialDate = getInitialDate();
    setReturnDate(initialDate);
    setInitialReturnDate(initialDate);
  }, [getInitialDate]);

  const closeDialog = useCallback(() => {
    setStatusEngagement(volunteer.statusEngagement);
    const initialDate = getInitialDate();
    setReturnDate(initialDate);
    setInitialReturnDate(initialDate);
    setIsOpen(false);
  }, [volunteer.statusEngagement, getInitialDate]);

  const saveDialog = useCallback(() => {
    const payload: { statusEngagement: VolunteerStateEngagementType; returnDate?: string } = {
      statusEngagement,
    };

    if (statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && returnDate) {
      payload.returnDate = returnDate.toISOString();
    }

    updateStatus(payload, {
      onSuccess: () => {
        if (statusEngagement === VolunteerStateEngagementType.TEMP_UNAVAILABLE && returnDate) {
          setInitialReturnDate(returnDate);
        }
        setIsOpen(false);
      },
    });
  }, [statusEngagement, returnDate, updateStatus]);

  return {
    isOpen,
    statusEngagement,
    returnDate,
    originalStatus: volunteer.statusEngagement,
    isSaveDisabled,
    openDialog,
    closeDialog,
    saveDialog,
    setStatusEngagement,
    setReturnDate,
  };
};
