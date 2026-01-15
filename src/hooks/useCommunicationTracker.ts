import { apiPathVolunteer, apiPathCommunication } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import { ApiCommunicationGet, ApiVolunteerCommunicationPost, ApiVolunteerCommunicationPatch } from "need4deed-sdk";
import axios from "axios";

export const useCommunicationTracker = (volunteerId: number) => {
  const queryKey = ["volunteer", String(volunteerId), "communications"];

  const { data: communications = [], isLoading } = useGetQuery<ApiCommunicationGet[]>({
    queryKey,
    apiPath: `${apiPathVolunteer}${volunteerId}/communication`,
  });

  const { mutate: createCommunication, isPending: isCreating } = useMutationQuery<ApiVolunteerCommunicationPost, unknown>({
    apiPath: `${apiPathVolunteer}${volunteerId}/communication`,
    method: "post",
    successMessage: "dashboard.communicationSection.communicationAdded",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: updateCommunication, isPending: isUpdating } = useMutationQuery<{ id: number; data: ApiVolunteerCommunicationPatch }, unknown>({
    mutationFn: ({ id, data }) => axios.patch(`${apiPathCommunication}/${id}`, data).then((res) => res.data),
    successMessage: "dashboard.communicationSection.communicationUpdated",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: deleteCommunication, isPending: isDeleting } = useMutationQuery<number, unknown>({
    mutationFn: (id) => axios.delete(`${apiPathCommunication}/${id}`).then((res) => res.data),
    successMessage: "dashboard.communicationSection.communicationDeleted",
    queryKeyToInvalidate: queryKey,
  });

  const sortedCommunications = [...communications].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return {
    communications: sortedCommunications,
    isLoading,
    createCommunication,
    isCreating,
    updateCommunication,
    isUpdating,
    deleteCommunication,
    isDeleting,
  };
};