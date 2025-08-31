"use client";

import { useEffect, useState } from "react";
import { DeviceProvider } from "@/context/DeviceContext";
import { ScreenTypes } from "@/config/constants";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [screenType, setScreenType] = useState<ScreenTypes>(ScreenTypes.DESKTOP);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad/.test(userAgent)) {
      setScreenType(ScreenTypes.MOBILE);
    } else if (/tablet/.test(userAgent)) {
      setScreenType(ScreenTypes.TABLET);
    } else {
      setScreenType(ScreenTypes.DESKTOP);
    }
  }, []);

  return <DeviceProvider initialScreenType={screenType}>{children}</DeviceProvider>;
}
