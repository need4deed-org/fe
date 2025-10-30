"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { DashboardLayout } from "@/components/Layout";
import { ApiOptionLists, EntityTableName, QueryParamsKeys, SortOrder } from "need4deed-sdk";
import { defaultVolunteerCardsFilter } from "./Filters/constants";
import { CardsFilter } from "./Filters/types";
import { useGetQuery } from "@/hooks";
import { apiPathOption, questionMark } from "@/config/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createFilterFromOption, deserializeFilters, serializeFilters } from "./helpers";
import Filters from "../common/CardsFilter/Filters";
import FiltersContent from "./Filters/FiltersContent";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { VolunteerListController } from "./VolunteerListController";

export function Volunteers() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [numOfVols, setNumOfVols] = useState(0);
  const [sortOrder, setSortOrder] = useState(SortOrder.NewToOld);
  const [cardsFilter, setCardsFilter] = useState(defaultVolunteerCardsFilter);
  const { data: option } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [t("dashboard.volunteers.tabs.tab1"), t("dashboard.volunteers.tabs.tab2")];

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, [QueryParamsKeys.SEARCH]: searchInput }));
  };

  const handleSortChange = (sortOrder: SortOrder) => {
    setSortOrder(sortOrder);
  };

  const handleFilterUpdate = (newFilter: CardsFilter | ((prev: CardsFilter) => CardsFilter)) => {
    const updatedFilter = typeof newFilter === "function" ? newFilter(cardsFilter) : newFilter;

    setCardsFilter(updatedFilter);
    router.push(pathname + questionMark + serializeFilters(updatedFilter, searchParams));
  };

  useEffect(() => {
    if (!option) return;

    // Merge and set 'district' - 'languages' of query params and API option
    cardsFilter.district = createFilterFromOption(option, EntityTableName.DISTRICT);
    cardsFilter.language = createFilterFromOption(option, EntityTableName.LANGUAGE);

    const updatedFilter = deserializeFilters(cardsFilter, searchParams);

    setCardsFilter(updatedFilter);
  }, [option]);

  return (
    <DashboardLayout>
      <VolunteersContainer>
        <Filters
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          filtersContent={<FiltersContent setFilter={handleFilterUpdate} filter={cardsFilter} />}
        />

        <CardsHeader
          header={t("dashboard.volunteers.volunteers")}
          resultCounter={numOfVols}
          resultText={t("dashboard.home.sidebar.volunteers")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={handleSearchInputChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
          filter={cardsFilter}
          setFilter={handleFilterUpdate}
        />
        <VolunteerListController
          setNumOfVols={setNumOfVols}
          sortOrder={sortOrder}
          isFiltersOpen={isFiltersOpen}
          filter={cardsFilter}
        />
      </VolunteersContainer>
    </DashboardLayout>
  );
}

export default Volunteers;

/** Styles */

const VolunteersContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-container-gap);
`;
