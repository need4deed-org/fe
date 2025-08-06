"use client";

import styled from "styled-components";
import { SubPageLayout } from "../Layout/subPageLayout";
import NavigationBar from "./NavigationBar";
import DashboardContent from "./DashboardContent";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: var(--dashboard-home-container-padding);
  gap: var(--dashboard-home-container-gap);
`;

export function Dashboard() {
  return (
    <SubPageLayout background="var(--color-white)">
      <DashboardContainer>
        <NavigationBar />
        <DashboardContent />
      </DashboardContainer>
    </SubPageLayout>
  );
}

export default Dashboard;
