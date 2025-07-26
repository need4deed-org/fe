"use client";

import i18next from "i18next";
import { Lang } from "need4deed-sdk";
import { initReactI18next, I18nextProvider } from "react-i18next";
import deTranslation from "../../public/locales/de/translations.json";
import enTranslation from "../../public/locales/en/translations.json";
import { getStoredLang } from "@/utils/helpers";
import { Env } from "@/types";

i18next.use(initReactI18next).init({
  lng: getStoredLang() || Lang.EN,
  fallbackLng: Lang.EN,
  debug: process.env.NODE_ENV === Env.DEVELOPMENT,
  resources: {
    [Lang.EN]: { translation: enTranslation },
    [Lang.DE]: { translation: deTranslation },
  },
  interpolation: { escapeValue: false },
});

i18next.changeLanguage();


interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}

