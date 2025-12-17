import { apiPathVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiVolunteerGet } from "need4deed-sdk";
import { DeepPartial } from "ts-type-safe";

type VolunteerProfileUpdateData = DeepPartial<
  Pick<ApiVolunteerGet, "languages" | "availability" | "activities" | "skills" | "locations">
>;

export const useUpdateVolunteerProfile = (volunteerId: number) => {
  return useMutationQuery<VolunteerProfileUpdateData, ApiVolunteerGet>({
    apiPath: `${apiPathVolunteer}${volunteerId}`,
    method: "patch",
    successMessage: "dashboard.volunteerProfile.profileSection.saveSuccess",
    queryKeyToInvalidate: ["volunteer", volunteerId],
  });
};
