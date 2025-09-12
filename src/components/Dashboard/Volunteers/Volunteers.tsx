"use client";

import styled from "styled-components";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/Layout";
import { useState } from "react";
import VolunteerCard from "./VolunteerCard";
import { mockVolunteer } from "./tempMockVolunteer";

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

        <VolunteerCard volunteer={mockVolunteer} />
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
