"use client";

import styled from "styled-components";

import { DashboardLayout } from "@/components/Layout";

import DashboardHomeContent from "./HomeContent";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: var(--dashboard-home-container-padding);
  gap: var(--dashboard-home-container-gap);
`;

export function DashboardHome() {
  return (
    <DashboardLayout>
      <HomeContainer>
        <DashboardHomeContent />
      </HomeContainer>
    </DashboardLayout>
  );
}

export default DashboardHome;
