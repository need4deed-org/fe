import { userAgent } from "next/server";
import { ScreenTypes } from "@/config/constants";
import { isEnumValue } from "@/utils/helpers";

export const getScreenType = (headers: Headers): ScreenTypes => {
  const deviceType = userAgent({ headers }).device.type;
  return isEnumValue(ScreenTypes, deviceType) ? (deviceType as ScreenTypes) : ScreenTypes.DESKTOP;
};
