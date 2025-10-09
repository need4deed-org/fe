import { useTranslation } from "react-i18next";
import { Button } from "@/components/core/button";
import { SetFilter } from "./types";
import { getClearFilter } from "./helpers";

interface Props<TFilter> {
  setFilter: SetFilter<TFilter>;
  filter: TFilter;
}

export default function ClearAllFilters<TFilter>({ setFilter, filter }: Props<TFilter>) {
  const { t } = useTranslation();

  const handleClick = () => {
    const clearFilter = getClearFilter(filter as object) as unknown as TFilter;
    setFilter(clearFilter);
  };

  return (
    <Button
      text={t("dashboard.filters.clearAll")}
      onClick={handleClick}
      backgroundcolor="var(--color-white)"
      textColor="var(--color-midnight)"
      height="44px"
      textFontSize="18px"
      textFontWeight={600}
      padding="12px"
    />
  );
}
