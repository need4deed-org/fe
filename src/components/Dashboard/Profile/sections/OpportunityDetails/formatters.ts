import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { ApiLanguage, Lang, LangPurpose, OptionById } from "need4deed-sdk";

export function formatLanguagesByPurpose(languages: ApiLanguage[], purpose: LangPurpose): string {
  const filtered = languages.filter((lang) => lang.purpose === purpose);
  if (filtered.length === 0) return EMPTY_PLACEHOLDER_VALUE;
  return filtered.map((lang) => lang.title).join(", ");
}

export function extractOptionTitles(items: OptionById[], lang: string): string[] {
  return items
    .map((item) => {
      if (!item.title) return "";
      return item.title[lang as Lang] ?? item.title[Lang.EN] ?? "";
    })
    .filter(Boolean);
}
