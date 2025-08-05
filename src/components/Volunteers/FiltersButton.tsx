import { useTranslation } from "react-i18next";
import { IconName } from "../core/button/Button/icon";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { Button } from "../core/button";

interface Props {
  setIsFiltersOpen: (isOpen: boolean) => void;
}

export default function FiltersButton({ setIsFiltersOpen }: Props) {
  const { t } = useTranslation();
  const screenSize = useScreenType();
  const isMobile = screenSize === ScreenTypes.MOBILE;

  return (
    <Button
      text={isMobile ? undefined : t("dashboard.volunteers.filters.button")}
      backgroundcolor="var(--color-midnight)"
      height="var(--dashboard-volunteers-header-filters-button-height)"
      width={isMobile ? "var(--dashboard-volunteers-header-filters-button-width)" : undefined}
      onClick={() => setIsFiltersOpen(true)}
      iconName={IconName.FadersHorizontal}
      iconSize="var(--dashboard-volunteers-header-filters-button-icon-size)"
    />
  );
}
