import { apiPathVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiVolunteerCommunicationPost } from "need4deed-sdk";

export const useCreateCommunication = (volunteerId: number) => {
  return useMutationQuery<ApiVolunteerCommunicationPost, { message: string }>({
    apiPath: `${apiPathVolunteer}${volunteerId}/communication`,
    method: "post",
    successMessage: "dashboard.communicationSection.communicationAdded",
    queryKeyToInvalidate: ["volunteer", String(volunteerId), "communications"],
  });
};
