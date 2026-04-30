import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet } from "need4deed-sdk";

export type OpportunityTitleUpdateData = {
  title: string;
};

export const useUpdateOpportunityTitle = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityTitleUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.opportunityDetails.saveSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
