import { useGetQuery } from "@/hooks";
import { ApiMyActivityItem } from "need4deed-sdk";
import { apiPathMe } from "@/config/constants";

export const useGetMyActivity = () => {
  const {
    data: activity = [],
    isLoading,
    isError,
  } = useGetQuery<ApiMyActivityItem[]>({
    queryKey: ["me", "activity"],
    apiPath: `${apiPathMe}/activity`,
  });

  return { activity, isLoading, isError };
};
