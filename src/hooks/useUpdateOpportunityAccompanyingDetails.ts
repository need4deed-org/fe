import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet } from "need4deed-sdk";

export type OpportunityAccompanyingDetailsUpdateData = {
  accompanyingDetails: {
    appointmentAddress?: string;
    refugeeNumber?: string;
    refugeeName?: string;
    languagesToTranslate?: string[];
  };
};

export const useUpdateOpportunityAccompanyingDetails = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityAccompanyingDetailsUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.accompanyingDetails.saveSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
