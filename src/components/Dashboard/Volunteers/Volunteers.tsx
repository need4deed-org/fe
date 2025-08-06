"use client";

import styled from "styled-components";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/Layout";
import { useState } from "react";

const VolunteersContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: var(--dashboard-volunteers-container-padding);
  gap: var(--dashboard-volunteers-container-gap);
`;

export function Volunteers() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const tabs = [t("dashboard.volunteers.tabs.tab1"), t("dashboard.volunteers.tabs.tab2")];

  const mockHandleInputChange = () => {};

  return (
    <DashboardLayout>
      <VolunteersContainer>
        <CardsHeader
          header={t("dashboard.volunteers.volunteers")}
          resultCounter={123}
          resultText={t("dashboard.home.sidebar.volunteers")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={mockHandleInputChange}
        />
      </VolunteersContainer>
    </DashboardLayout>
  );
}

export default Volunteers;
