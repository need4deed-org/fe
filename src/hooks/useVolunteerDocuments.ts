import { useGetQuery } from "@/hooks/useGetQuery";
import { ApiDocumentGet } from "need4deed-sdk";

export const useVolunteerDocuments = (volunteerId: number) => {
  return useGetQuery<ApiDocumentGet[]>({
    apiPath: `/api/volunteer/${volunteerId}/doc`,
    queryKey: ["volunteerDocuments", volunteerId.toString()],
  });
};
