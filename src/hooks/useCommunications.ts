import { apiPathVolunteer } from "@/config/constants";
import { ApiCommunicationGet } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";

export const useCommunications = (volunteerId: number) => {
  return useGetQuery<ApiCommunicationGet[]>({
    queryKey: ["volunteer", String(volunteerId), "communications"],
    apiPath: `${apiPathVolunteer}${volunteerId}/communication`,
  });
};
