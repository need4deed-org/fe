import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet } from "need4deed-sdk";

export type OpportunityRacUpdateData = {
  rac: {
    name?: string;
    address?: string;
    district?: string;
  };
};

export const useUpdateOpportunityRac = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityRacUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.rac.saveSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
