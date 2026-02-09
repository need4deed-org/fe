import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { AgentEngagementStatus, ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";

export type AgentStatusUpdateData = {
  statusEngagement: AgentEngagementStatus;
};

export const useUpdateAgentStatus = (agentId: number) => {
  return useMutationQuery<AgentStatusUpdateData, { message: string; data: ApiAgentProfileGet }>({
    apiPath: `${apiPathAgent}/${agentId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.statusUpdateSuccess",
    queryKeyToInvalidate: ["agent", String(agentId)],
  });
};
