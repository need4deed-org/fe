"use client";

import { DashboardLayout } from "@/components/Layout";
import { apiPathOption, questionMark } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOptionLists, EntityTableName, SortOrder } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Filters from "../common/CardsFilter/Filters";
import { createFilterFromOption, getClearFilter } from "../common/CardsFilter/helpers";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { AgentListController } from "./AgentListController";
import { defaultAgentCardsFilter } from "./Filters/constants";
import FiltersContent from "./Filters/FiltersContent";
import { createSelectedAgentFiltersAsFlatArray } from "./Filters/helpers";
import { AgentCardsFilter } from "./Filters/types";
import { serializeAgentFilters } from "./helpers";
import { AgentsContainer } from "./styles";

export const Agents = () => {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState(SortOrder.NewToOld);
  const [cardsFilter, setCardsFilter] = useState(defaultAgentCardsFilter);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    t("dashboard.opportunities.tabs.tab1"),
    t("dashboard.opportunities.tabs.tab2"),
    t("dashboard.opportunities.tabs.tab3"),
  ];

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, search: searchInput }));
  };

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
  };

  const handleFilterUpdate = (newFilter: AgentCardsFilter | ((prev: AgentCardsFilter) => AgentCardsFilter)) => {
    const updatedFilter = typeof newFilter === "function" ? newFilter(cardsFilter) : newFilter;
    setCardsFilter(updatedFilter);
    router.push(pathname + questionMark + serializeAgentFilters(updatedFilter, searchParams));
  };

  const handleClearAllFilters = () => {
    const cleared = getClearFilter(cardsFilter) as unknown as AgentCardsFilter;
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeAgentFilters(cleared, searchParams));
  };

  useEffect(() => {
    if (!apiFilterOptions) return;

    setCardsFilter((prev) => {
      const district = createFilterFromOption(apiFilterOptions, EntityTableName.DISTRICT);
      return { ...prev, district };
    });
  }, [apiFilterOptions]);

  const activeFilters = createSelectedAgentFiltersAsFlatArray(cardsFilter, setCardsFilter, t);
  return (
    <DashboardLayout>
      <AgentsContainer data-testid="agents-container">
        <Filters
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          filtersContent={<FiltersContent setFilter={handleFilterUpdate} filter={cardsFilter} />}
        />

        <CardsHeader
          header={t("dashboard.agents.agents")}
          // TODO, will use numOfOpps state when implement API call
          resultCounter={0}
          resultText={t("dashboard.home.sidebar.racs")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={handleSearchInputChange}
          searchValue={cardsFilter.search}
          searchPlaceholder={t("dashboard.agents.card.search")}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
          activeFilters={activeFilters}
          onClearAllFilters={handleClearAllFilters}
        />
        <AgentListController />
      </AgentsContainer>
    </DashboardLayout>
  );
};
