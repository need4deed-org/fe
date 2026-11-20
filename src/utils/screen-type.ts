import { userAgent } from "next/server";
import { ScreenTypes } from "@/config/constants";
import { isEnumValue } from "ts-type-safe";

export const getScreenType = (headers: Headers): ScreenTypes => {
  const deviceType = userAgent({ headers }).device.type;
  return isEnumValue(ScreenTypes, deviceType) ? deviceType : ScreenTypes.DESKTOP;
};
