import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { LanguageObject } from "@/types";
import { TFunction } from "i18next";
import { ApiLanguage, Lang, LangPurpose, OptionById } from "need4deed-sdk";

export function formatLanguagesByPurpose(languages: ApiLanguage[], purpose: LangPurpose, t: TFunction): string {
  const filtered = languages.filter((lang) => lang.purpose === purpose);
  if (filtered.length === 0) return EMPTY_PLACEHOLDER_VALUE;
  return filtered
    .map((lang) => {
      const key = `languageNames.${lang.title.toLowerCase()}`;
      const translated = t(key);
      const hasTranslation = translated !== key;
      return hasTranslation ? translated : lang.title;
    })
    .join(", ");
}

export function extractOptionTitles(items: OptionById[], lang: string): string[] {
  return items
    .map((item) => {
      if (!item.title) return "";
      return item.title[lang as Lang] ?? item.title[Lang.EN] ?? "";
    })
    .filter(Boolean);
}

export function languagesToFormValues(langs: ApiLanguage[]): LanguageObject[] {
  if (langs.length === 0) return [{ id: 1, language: "", level: "" }];
  return langs.map((lang) => ({ id: lang.id, language: String(lang.id), level: "" as const }));
}
