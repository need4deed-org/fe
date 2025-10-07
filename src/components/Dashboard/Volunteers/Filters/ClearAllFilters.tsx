import { useTranslation } from "react-i18next";
import { Button } from "@/components/core/button";
import { CardsFilter, SetFilter } from "./types";
import { getClearFilter } from "./helpers";

interface Props {
  setFilter: SetFilter;
  filter: CardsFilter;
}

export default function ClearAllFilters({ setFilter, filter }: Props) {
  const { t } = useTranslation();

  const handleClick = () => {
    const { search } = filter;
    const clearFilter = getClearFilter(filter) as unknown as CardsFilter;

    /* Exclude 'search' input from cleaning process */
    clearFilter.search = search;

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
