import { useUpdateAgentStatus } from "@/hooks/useUpdateAgentStatus";
import { useMemo, useState } from "react";
import { AgentEngagementStatus, ApiAgentProfileGet } from "../../../types/agent";

export type UseAgentEngagementStatusDialogReturn = {
  isOpen: boolean;
  statusEngagement: AgentEngagementStatus;
  originalStatus: AgentEngagementStatus;
  isSaveDisabled: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  saveDialog: () => void;
  setStatusEngagement: (status: AgentEngagementStatus) => void;
};

export const useAgentEngagementStatusDialog = (agent: ApiAgentProfileGet): UseAgentEngagementStatusDialogReturn => {
  const { mutate: updateStatus } = useUpdateAgentStatus(agent.id);

  const [isOpen, setIsOpen] = useState(false);
  const [statusEngagement, setStatusEngagement] = useState<AgentEngagementStatus>(agent.statusEngagement);

  const isSaveDisabled = useMemo(
    () => statusEngagement === agent.statusEngagement,
    [statusEngagement, agent.statusEngagement],
  );

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setStatusEngagement(agent.statusEngagement);
    setIsOpen(false);
  };

  const saveDialog = () => {
    updateStatus(
      { statusEngagement },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      },
    );
  };

  return {
    isOpen,
    statusEngagement,
    originalStatus: agent.statusEngagement,
    isSaveDisabled,
    openDialog,
    closeDialog,
    saveDialog,
    setStatusEngagement,
  };
};
