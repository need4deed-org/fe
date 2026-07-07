import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet, OpportunityType } from "need4deed-sdk";

export type OpportunityTypeUpdateData = {
  volunteerType: OpportunityType;
};

export const useUpdateOpportunityType = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityTypeUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.typeUpdateSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
