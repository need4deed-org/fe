import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet, OptionById } from "need4deed-sdk";

type AgentUpdateData = {
  name?: string;
  address?: string;
  district?: OptionById["id"];
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
