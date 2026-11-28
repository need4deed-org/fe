import { ReactNode, use } from "react";
import { notFound } from "next/navigation";
import { I18nProvider } from "@/config/i18next";
import { isValidLanguage } from "@/utils/helpers";

type LanguageLayoutProps = Readonly<{
  params: Promise<{
    lang: string;
  }>;
  children: ReactNode;
}>;

export default function LanguageLayout({ params, children }: LanguageLayoutProps) {
  const { lang } = use(params);
  if (!isValidLanguage(lang)) notFound();

  return <I18nProvider initialLang={lang}>{children}</I18nProvider>;
}
