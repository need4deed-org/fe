import { apiPathVolunteer } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { ApiDocumentGet } from "need4deed-sdk";

export const useVolunteerDocuments = (volunteerId: number) => {
  return useGetQuery<ApiDocumentGet[]>({
    apiPath: `${apiPathVolunteer}${volunteerId}/doc`,
    queryKey: ["volunteerDocuments", volunteerId.toString()],
  });
};
