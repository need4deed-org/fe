import { apiPathOption } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import { Lang } from "need4deed-sdk";

export type ApiLanguageOption = {
  id: number;
  title: string;
  isoCode?: string;
};

export function useApiLanguages(currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: ["languages", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/language?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch languages");
      const data = await response.json();
      return data.data.language || [];
    },
    staleTime: Infinity,
  });
}

export function useApiActivities(currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: ["activities", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/activity?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      return data.data.activity || [];
    },
    staleTime: Infinity,
  });
}

export function useApiSkills(currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: ["skills", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/skill?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      return data.data.skill || [];
    },
    staleTime: Infinity,
  });
}

export function useApiDistricts(currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: ["districts", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/district?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch districts");
      const data = await response.json();
      return data.data.district || [];
    },
    staleTime: Infinity,
  });
}
