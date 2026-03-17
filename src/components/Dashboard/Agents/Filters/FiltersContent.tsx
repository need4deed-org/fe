import { useTranslation } from "react-i18next";
import { AgentCardsFilter } from "./types";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { SetFilter } from "../../common/CardsFilter/types";
import { createAgentFilterItems } from "./helpers";
import { FiltersContentContainer } from "./styles";

type Props = {
  filter: AgentCardsFilter;
  setFilter: SetFilter<AgentCardsFilter>;
};

export default function FiltersContent({ setFilter, filter }: Props) {
  const { t } = useTranslation();

  const { districtFilters, volunteerSearchFilters, typeFilters, engagementStatusFilters, servicesFilters } =
    createAgentFilterItems(filter, setFilter, t);

  return (
    <FiltersContentContainer data-testid="agent-filters-content">
      <AccordionFilter header={t("dashboard.agents.filters.type.header")} items={typeFilters} />
      <AccordionFilter header={t("dashboard.agents.filters.volunteerSearch.header")} items={volunteerSearchFilters} />
      <AccordionFilter header={t("dashboard.agents.filters.district.header")} items={districtFilters} />
      <AccordionFilter header={t("dashboard.agents.filters.engagementStatus.header")} items={engagementStatusFilters} />
      <AccordionFilter header={t("dashboard.agents.filters.services.header")} items={servicesFilters} />
    </FiltersContentContainer>
  );
}
