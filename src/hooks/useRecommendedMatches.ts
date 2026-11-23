import { apiPathOpportunity, apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import {
  ApiRecommendedOpportunity,
  ApiRecommendedVolunteer,
  Id,
  RECOMMENDED_MATCHES_DEFAULT_LIMIT,
} from "need4deed-sdk";

export const recommendedVolunteersKey = (opportunityId: Id) => ["recommended-volunteers", String(opportunityId)];
export const recommendedOpportunitiesKey = (volunteerId: Id) => ["recommended-opportunities", String(volunteerId)];

export const useRecommendedVolunteers = (opportunityId: Id, enabled: boolean) =>
  useGetQuery<ApiRecommendedVolunteer[]>({
    queryKey: recommendedVolunteersKey(opportunityId),
    apiPath: `${apiPathOpportunity}/${opportunityId}/recommended-volunteers`,
    params: { limit: RECOMMENDED_MATCHES_DEFAULT_LIMIT },
    staleTime: cacheTTL,
    enabled,
  });

export const useRecommendedOpportunities = (volunteerId: Id, enabled: boolean) =>
  useGetQuery<ApiRecommendedOpportunity[]>({
    queryKey: recommendedOpportunitiesKey(volunteerId),
    apiPath: `${apiPathVolunteer}/${volunteerId}/recommended-opportunities`,
    params: { limit: RECOMMENDED_MATCHES_DEFAULT_LIMIT },
    staleTime: cacheTTL,
    enabled,
  });
