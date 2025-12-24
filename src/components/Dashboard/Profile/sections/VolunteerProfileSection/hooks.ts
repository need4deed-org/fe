import { apiPathOption } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import { Lang } from "need4deed-sdk";

export type ApiLanguageOption = {
  id: number;
  title: string;
  isoCode?: string;
};

type ResourceType = "language" | "activity" | "skill" | "district";

function useApiResource(resource: ResourceType, currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: [resource, currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/${resource}?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Failed to fetch ${resource}`);
      const data = await response.json();
      return data.data[resource] || [];
    },
    staleTime: Infinity,
  });
}

export const useApiLanguages = (lang: Lang) => useApiResource("language", lang);
export const useApiActivities = (lang: Lang) => useApiResource("activity", lang);
export const useApiSkills = (lang: Lang) => useApiResource("skill", lang);
export const useApiDistricts = (lang: Lang) => useApiResource("district", lang);
