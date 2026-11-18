"use client";
import { I18nProvider } from "@/config/i18next";
import { ReactNode, use } from "react";
import { WebsiteNavigation } from "@/components/navigation/WebsiteNavigation";

type WebsiteLayoutProps = Readonly<{
  params: Promise<{
    lang: string;
  }>;
  children: ReactNode;
}>;

export default function WebsiteLayout({ params, children }: WebsiteLayoutProps) {
  const { lang } = use(params);

  return (
    <I18nProvider initialLang={lang}>
      <WebsiteNavigation>{children}</WebsiteNavigation>
    </I18nProvider>
  );
}
