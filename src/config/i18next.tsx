"use client";

import i18next from "i18next";
import { Lang } from "need4deed-sdk";
import { initReactI18next, I18nextProvider } from "react-i18next";
import deTranslation from "../../public/locales/de/translations.json";
import enTranslation from "../../public/locales/en/translations.json";
import { Env } from "@/types";
import { useEffect } from "react";

i18next.use(initReactI18next).init({
  fallbackLng: Lang.DE,
  debug: process.env.NODE_ENV === Env.DEVELOPMENT,
  resources: {
    [Lang.EN]: { translation: enTranslation },
    [Lang.DE]: { translation: deTranslation },
  },
  interpolation: { escapeValue: false },
});

interface I18nProviderProps {
  children: React.ReactNode;
  initialLang: string;
}

export function I18nProvider({ children, initialLang }: I18nProviderProps) {
  useEffect(() => {
    // Check if the language actually needs changing to prevent unnecessary calls
    if (i18next.language !== initialLang) {
      i18next.changeLanguage(initialLang);
    }
  }, [initialLang]); // Re-run effect only when initialLang changes

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
