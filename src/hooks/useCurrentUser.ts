import { apiPathMe, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiUserGet } from "need4deed-sdk";

export const useCurrentUser = (enabled?: boolean) => {
  const { data } = useGetQuery<ApiUserGet>({
    queryKey: ["user"],
    apiPath: apiPathMe,
    staleTime: cacheTTL,
    enabled,
  });

  return data;
};
