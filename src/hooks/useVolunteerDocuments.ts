import { useQuery } from "@tanstack/react-query";
import { getVolunteerDocuments } from "@/lib/api/volunteer";
import { ApiDocumentGet } from "need4deed-sdk";

export const useVolunteerDocuments = (volunteerId: number) => {
  return useQuery<ApiDocumentGet[], Error>({
    queryKey: ["volunteerDocuments", volunteerId],
    queryFn: () => getVolunteerDocuments(volunteerId),
  });
};
