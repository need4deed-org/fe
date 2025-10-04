"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import CardsHeader from "../common/CardsHeader/CardsHeader";
import { DashboardLayout } from "@/components/Layout";
import { VolunteerListController } from "./VolunteerListController";
import { ApiOptionLists, EntityTableName, SortOrder } from "need4deed-sdk";
import Filters from "./Filters/Filters";
import { defaultVolunteerCardsFilter } from "./Filters/constants";
import { CardsFilter } from "./Filters/types";
import { useGetQuery } from "@/hooks";
import { apiPathOption, questionMark } from "@/config/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createFilterFromOption, deserializeFilters, serializeFilters } from "./helpers";

export function Volunteers() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [numOfVols, setNumOfVols] = useState(0);
  const [sortOrder, setSortOrder] = useState(SortOrder.NewToOld);
  const [cardsFilter, setCardsFilter] = useState(defaultVolunteerCardsFilter);
  const { data: option } = useGetQuery<ApiOptionLists>({
    queryKey: ["options"],
    apiPath: apiPathOption,
  });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [t("dashboard.volunteers.tabs.tab1"), t("dashboard.volunteers.tabs.tab2")];

  const mockHandleInputChange = () => {};

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
    cardsFilter.languages = createFilterFromOption(option, EntityTableName.LANGUAGE);

    const updatedFilter = deserializeFilters(cardsFilter, searchParams);
    console.log("updatedFilter:", updatedFilter);

    setCardsFilter(updatedFilter);
  }, [option]);

  return (
    <DashboardLayout>
      <VolunteersContainer>
        <Filters
          isFiltersOpen={isFiltersOpen}
          setFilter={handleFilterUpdate}
          filter={cardsFilter}
          setIsFiltersOpen={setIsFiltersOpen}
        />

        <CardsHeader
          header={t("dashboard.volunteers.volunteers")}
          resultCounter={numOfVols}
          resultText={t("dashboard.home.sidebar.volunteers")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={mockHandleInputChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
        />
        <VolunteerListController setNumOfVols={setNumOfVols} sortOrder={sortOrder} isFiltersOpen={isFiltersOpen} />
      </VolunteersContainer>
    </DashboardLayout>
  );
}

export default Volunteers;

/** Styles */
const VolunteersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-container-gap);
`;
