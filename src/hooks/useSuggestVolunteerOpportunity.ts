import { apiPathOpportunityVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";

type SuggestPayload = {
  opportunityId: number;
  volunteerId: number;
  status: OpportunityVolunteerStatusType;
};

export const useSuggestVolunteerOpportunity = (onSuccess?: () => void) => {
  return useMutationQuery<SuggestPayload, unknown>({
    apiPath: apiPathOpportunityVolunteer,
    method: "post",
    successMessage: "dashboard.volunteerProfile.suggestDialog.success",
    onSuccessCallback: onSuccess,
  });
};
