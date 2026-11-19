import AxiosInitializer from "@/components/hepler/AxiosInitializer";
import "@/config/axios";
import { DeviceProvider } from "@/context/DeviceContext";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { resolveLanguage } from "@/utils/helpers";
import { getScreenType } from "@/utils/screen-type";
import QueryProvider from "@/utils/QueryProvider";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { headers } from "next/headers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nProvider } from "../../config/i18next";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Need4Deed",
  description: "Need4Deed application for volunteers, RACs, and back office",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;

  const initialScreenType = getScreenType(await headers());
  return (
    <html lang={resolveLanguage(lang)}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
      </head>
      <AxiosInitializer />
      <body className={figtree.variable}>
        <StyledComponentsRegistry>
          <QueryProvider>
            <DeviceProvider initialScreenType={initialScreenType}>
              <I18nProvider initialLang={lang}>{children}</I18nProvider>
            </DeviceProvider>
          </QueryProvider>
        </StyledComponentsRegistry>

        <ToastContainer />
      </body>
    </html>
  );
}
