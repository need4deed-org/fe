import { apiPathVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiVolunteerGet } from "need4deed-sdk";

export type VolunteerStatusUpdateData = Pick<ApiVolunteerGet, "statusEngagement"> & {
  dateReturn: string | null;
};

export const useUpdateVolunteerStatus = (volunteerId: number) => {
  return useMutationQuery<VolunteerStatusUpdateData, { message: string; data: ApiVolunteerGet }>({
    apiPath: `${apiPathVolunteer}/${volunteerId}`,
    method: "patch",
    successMessage: "dashboard.volunteerProfile.volunteerHeader.statusUpdateSuccess",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });
};
