import { apiPathCommunication } from "@/config/constants";
import { useMutationQuery } from "@/hooks";

export const useDeleteCommunication = (volunteerId: number, communicationId: number) => {
  return useMutationQuery<unknown, { message: string }>({
    apiPath: `${apiPathCommunication}/${communicationId}`,
    method: "delete",
    successMessage: "dashboard.communicationSection.communicationDeleted",
    queryKeyToInvalidate: ["volunteer", String(volunteerId), "communications"],
  });
};
