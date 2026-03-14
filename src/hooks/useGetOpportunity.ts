import { apiPathOpportunity, cacheTTL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { ApiOpportunityGetList } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";

type ApiOpportunityWithAvatar = ApiOpportunityGetList & { avatarUrl?: string };

export const useGetOpportunity = (opportunityId: string | undefined) => {
  const { data } = useGetQuery<ApiOpportunityWithAvatar>({
    queryKey: ["opportunity", opportunityId ?? ""],
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    staleTime: cacheTTL,
    enabled: !!opportunityId,
  });

  if (!data) return undefined;

  return {
    name: data.title,
    avatarUrl: data.avatarUrl ? getImageUrl(data.avatarUrl) : undefined,
  };
};
