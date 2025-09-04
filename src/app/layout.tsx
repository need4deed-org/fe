import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "../config/i18next";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import QueryProvider from "@/utils/QueryProvider";
import { headers } from "next/headers";
import { ScreenTypes } from "@/config/constants";
import { DeviceProvider } from "@/context/DeviceContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
      </head>
      <body className={figtree.variable}>
        <StyledComponentsRegistry>
          <QueryProvider>
            <DeviceProvider initialScreenType={initialScreenType}>
              <I18nProvider>{children}</I18nProvider>
            </DeviceProvider>
          </QueryProvider>
        </StyledComponentsRegistry>

        <ToastContainer />
      </body>
    </html>
  );
}
