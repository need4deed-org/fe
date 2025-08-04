"use client";

import styled from "styled-components";
import { SubPageLayout } from "../Layout/subPageLayout";
import NavigationBar from "./NavigationBar";
import DashboardContent from "./DashboardContent";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 40px 120px 100px 132px;
  gap: 20px;
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
