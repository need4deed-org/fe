import { routes } from "@/constants/routes";
import N4DLogoFlat from "@/components/svg/N4DLogoFlat";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const logoSizeMap = {
  [ScreenTypes.DESKTOP]: { width: "230", height: "32" },
  [ScreenTypes.TABLET]: { width: "230", height: "32" },
  [ScreenTypes.MOBILE]: { width: "144", height: "24" },
};

export function N4DLogo() {
  const screenType = useScreenType();
  const [logoWidth, setLogoWidth] = useState(logoSizeMap[screenType].width);
  const [logoHeight, setLogoHeight] = useState(logoSizeMap[screenType].height);
  const router = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    const computedWidth = getComputedStyle(document.documentElement).getPropertyValue(
      "--layout-static-page-n4d-logo-width",
    );
    const computedHeight = getComputedStyle(document.documentElement).getPropertyValue(
      "--layout-static-page-n4d-logo-height",
    );

    setLogoWidth(computedWidth);
    setLogoHeight(computedHeight);
  }, [screenType]);

  return (
    <N4DLogoFlat
      color="var(--blue)"
      width={logoWidth}
      height={logoHeight}
      onClick={() => {
        router.push(routes.home(i18n.language));
      }}
    />
  );
}

export default N4DLogo;
