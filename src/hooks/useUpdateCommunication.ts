import { apiPathCommunication } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiVolunteerCommunicationPatch } from "need4deed-sdk";

export const useUpdateCommunication = (volunteerId: number, communicationId: number) => {
  return useMutationQuery<ApiVolunteerCommunicationPatch, { message: string }>({
    apiPath: `${apiPathCommunication}/${communicationId}`,
    method: "patch",
    successMessage: "dashboard.communicationSection.communicationUpdated",
    queryKeyToInvalidate: ["volunteer", String(volunteerId), "communications"],
  });
};
