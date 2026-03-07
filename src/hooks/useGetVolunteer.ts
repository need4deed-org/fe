import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";

export const useGetVolunteer = (volunteerId: string | undefined) => {
  const { data } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteer", volunteerId ?? ""],
    apiPath: `${apiPathVolunteer}${volunteerId}`,
    staleTime: cacheTTL,
    enabled: !!volunteerId,
  });

  if (!data) return undefined;

  return {
    name: `${data.person.firstName} ${data.person.lastName}`,
  };
};
