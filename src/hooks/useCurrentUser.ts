import { apiPathMe, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { ApiUserGet } from "need4deed-sdk";
import { useEffect } from "react";

export const useCurrentUser = (enabled?: boolean) => {
  const hasAuthHint = getCookie("is_logged_in") === "true";

  const { data } = useGetQuery<ApiUserGet>({
    queryKey: ["user"],
    apiPath: apiPathMe,
    staleTime: cacheTTL,
    enabled: hasAuthHint && enabled,
  });

  return data;
};
