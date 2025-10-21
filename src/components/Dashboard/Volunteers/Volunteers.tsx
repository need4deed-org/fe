"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { DashboardLayout } from "@/components/Layout";
import { SortOrder } from "need4deed-sdk";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { VolunteerListController } from "./VolunteerListController";

export function Volunteers() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [numOfVols, setNumOfVols] = useState(0);
  const [sortOrder, setSortOrder] = useState(SortOrder.NewToOld);

  const tabs = [t("dashboard.volunteers.tabs.tab1"), t("dashboard.volunteers.tabs.tab2")];

  const mockHandleInputChange = () => {};

  const handleSortChange = (sortOrder: SortOrder) => {
    setSortOrder(sortOrder);
  };

  if (isFiltersOpen) {
    return null;
  }
  return (
    <DashboardLayout>
      <VolunteersContainer>
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

        <VolunteerListController setNumOfVols={setNumOfVols} sortOrder={sortOrder} />
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
