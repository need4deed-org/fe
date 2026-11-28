import "./reset.css";
import "./variables.css";
import AxiosInitializer from "@/components/hepler/AxiosInitializer";
import "@/config/axios";
import { ScreenTypes } from "@/config/constants";
import { DeviceProvider } from "@/context/DeviceContext";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import QueryProvider from "@/utils/QueryProvider";
import type { Metadata } from "next";
import { Figtree, Barlow_Condensed } from "next/font/google";
import { headers } from "next/headers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ReactNode } from "react";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Need4Deed",
  description: "Need4Deed application for volunteers, RACs, and back office",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const getInitialDeviceType = async () => {
    const headersList = await headers();
    const deviceTypeHeader = headersList.get("x-device-type");

    switch (deviceTypeHeader) {
      case "mobile":
        return ScreenTypes.MOBILE;
      case "tablet":
        return ScreenTypes.TABLET;
      default:
        return ScreenTypes.DESKTOP;
    }
  };

  const initialScreenType = await getInitialDeviceType();
  return (
    <html lang="en" className={`${figtree.variable} ${barlowCondensed.variable}`}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
      </head>
      <AxiosInitializer />
      <body>
        <StyledComponentsRegistry>
          <QueryProvider>
            <DeviceProvider initialScreenType={initialScreenType}>{children}</DeviceProvider>
          </QueryProvider>
        </StyledComponentsRegistry>

        <ToastContainer />
      </body>
    </html>
  );
}
