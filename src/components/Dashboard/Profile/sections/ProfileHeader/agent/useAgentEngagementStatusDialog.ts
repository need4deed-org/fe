import { useUpdateAgentStatus } from "@/hooks/useUpdateAgentStatus";

import { AgentEngagementStatus, ApiAgentProfileGet } from "../../../types/agent";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";

export type UseAgentEngagementStatusDialogReturn = UseStatusDialogReturn<AgentEngagementStatus>;

export const useAgentEngagementStatusDialog = (agent: ApiAgentProfileGet): UseAgentEngagementStatusDialogReturn => {
  const { mutate: updateStatus } = useUpdateAgentStatus(agent.id);

  const onSave = (status: AgentEngagementStatus, { onSuccess }: { onSuccess: () => void }) => {
    updateStatus({ statusEngagement: status }, { onSuccess });
  };

  return useStatusDialog({
    initial: agent.statusEngagement,
    onSave,
  });
};
