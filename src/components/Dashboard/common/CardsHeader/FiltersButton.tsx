import type { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { IconName } from "../../../core/button/Button/icon";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { Button } from "../../../core/button";

interface Props {
  panelId: string;
  isFiltersOpen: boolean;
  onToggle: MouseEventHandler<HTMLButtonElement>;
}

export default function FiltersButton({ panelId, isFiltersOpen, onToggle }: Props) {
  const { t } = useTranslation();
  const screenSize = useScreenType();
  const isMobile = screenSize === ScreenTypes.MOBILE;

  return (
    <Button
      text={isMobile ? undefined : t("dashboard.filters.button")}
      backgroundcolor="var(--color-aubergine)"
      height="var(--opportunities-filters-button-height)"
      width={isMobile ? "var(--opportunities-filters-button-width)" : undefined}
      onClick={onToggle}
      iconName={IconName.Faders}
      iconSize="var(--opportunities-filters-button-icon-size)"
      aria-controls={panelId}
      aria-expanded={isFiltersOpen}
      aria-label={t("dashboard.filters.button")}
    />
  );
}
