import { I18nProvider } from "@/config/i18next";
import { ReactNode } from "react";
import { AppNavigation } from "@/components/navigation/AppNavigation";

type AppLayoutProps = Readonly<{
  params: Promise<{
    lang: string;
  }>;
  children: ReactNode;
}>;

export default async function AppLayout({ params, children }: AppLayoutProps) {
  const { lang } = await params;

  return (
    <I18nProvider initialLang={lang}>
      <AppNavigation>{children}</AppNavigation>
    </I18nProvider>
  );
}
