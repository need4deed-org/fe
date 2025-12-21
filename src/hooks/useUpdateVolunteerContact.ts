import { ApiVolunteerGet } from "need4deed-sdk";
import { useMutationQuery } from "@/hooks";
import { apiPathVolunteer } from "@/config/constants";
import { DeepPartial } from "ts-type-safe";

export const useUpdateVolunteerContact = (volunteerId: string) => {
  return useMutationQuery<DeepPartial<ApiVolunteerGet>, ApiVolunteerGet>({
    apiPath: `${apiPathVolunteer}${volunteerId}`,
    method: "patch",
    successMessage: "dashboard.volunteerProfile.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["volunteer", volunteerId],
  });
};
