import { apiPathVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiVolunteerSuggestionRequestPost } from "need4deed-sdk";

export const useRequestOwnerSuggestion = (volunteerId: number) =>
  useMutationQuery<ApiVolunteerSuggestionRequestPost, unknown>({
    apiPath: `${apiPathVolunteer}/${volunteerId}/suggestion-request`,
    method: "post",
    successMessage: "dashboard.volunteerProfile.requestSuggest.ownerSuccess",
  });
