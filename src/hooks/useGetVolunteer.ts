import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";

export const useGetVolunteer = (volunteerId: string | undefined) => {
  const { data } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteer-info", volunteerId ?? ""],
    apiPath: `${apiPathVolunteer}${volunteerId}`,
    staleTime: cacheTTL,
    enabled: !!volunteerId,
  });

  if (!data) return undefined;

  const name = `${data.person.firstName} ${data.person.lastName}`.trim();
  const avatarUrl = data.person.avatarUrl ? getImageUrl(data.person.avatarUrl) : undefined;

  return { name, avatarUrl };
};
