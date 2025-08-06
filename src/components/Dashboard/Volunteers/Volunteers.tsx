"use client";

import styled from "styled-components";
import CardsHeader from "../CardsHeader";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/Layout";

const VolunteersContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: var(--dashboard-volunteers-container-padding);
  gap: var(--dashboard-volunteers-container-gap);
`;

export function Volunteers() {
  const { t } = useTranslation();

  const tabs = [t("dashboard.volunteers.tabs.tab1"), t("dashboard.volunteers.tabs.tab2")];

  return (
    <DashboardLayout>
      <VolunteersContainer>
        <CardsHeader tabs={tabs} />
      </VolunteersContainer>
    </DashboardLayout>
  );
}

export default Volunteers;
