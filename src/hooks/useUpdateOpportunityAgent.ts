import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet } from "need4deed-sdk";

type AgentUpdateData = {
  name?: string;
};

export type OpportunityAgentUpdateData = {
  agent: AgentUpdateData;
};

export const useUpdateOpportunityAgent = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityAgentUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.rac.saveSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
