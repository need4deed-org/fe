import { ApiVolunteerOpportunityGet, Id } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";
import { apiPathOpportunity, cacheTTL } from "@/config/constants";

export const useGetVolunteerOpportunityLinked = (
  opportunityId: Id,
  { volunteerId, enabled }: { volunteerId?: string; enabled: boolean },
) => {
  const { data, isLoading, isError } = useGetQuery<ApiVolunteerOpportunityGet[]>({
    queryKey: ["opportunity-volunteers", String(opportunityId)],
    apiPath: `${apiPathOpportunity}/${opportunityId}/volunteer-linked`,
    staleTime: cacheTTL,
    enabled: enabled && !!opportunityId,
  });

  const isAlreadyMatched = getIsAlreadyMatched(data, isError, volunteerId);

  return { data, isLoading, isAlreadyMatched };
};

function getIsAlreadyMatched(
  data: ApiVolunteerOpportunityGet[] | undefined,
  isError: boolean,
  volunteerId?: string,
): boolean | undefined {
  if (!volunteerId) return false;
  if (!data || isError) return undefined;
  return data.some((vol) => vol.volunteerId === Number(volunteerId));
}
