import { useTranslation } from "react-i18next";
import { OpportunityCardsFilter } from "./types";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { SetFilter } from "../../common/CardsFilter/types";
import { createOpportunityFilterItems } from "./helpers";
import { FiltersContentContainer } from "./styles";

type Props = {
  filter: OpportunityCardsFilter;
  setFilter: SetFilter<OpportunityCardsFilter>;
};

export default function FiltersContent({ setFilter, filter }: Props) {
  const { t } = useTranslation();

  const { districtFilters, languageFilters, statusFilters } = createOpportunityFilterItems(filter, setFilter, t);

  return (
    <FiltersContentContainer data-testid="opportunity-filters-content">
      <AccordionFilter header={t("dashboard.opportunities.filters.status.header")} items={statusFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.district")} items={districtFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.languages")} items={languageFilters} />
    </FiltersContentContainer>
  );
}
