import { ReactNode, use } from "react";
import { I18nProvider } from "@/config/i18next";

type LanguageLayoutProps = Readonly<{
  params: Promise<{
    lang: string;
  }>;
  children: ReactNode;
}>;

export default function LanguageLayout({ params, children }: LanguageLayoutProps) {
  const { lang } = use(params);

  return <I18nProvider initialLang={lang}>{children}</I18nProvider>;
}
