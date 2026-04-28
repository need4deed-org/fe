"use client";

import DashboardHomeContent from "./HomeContent";
import { DashboardLayout } from "@/components/Layout";
import { HomeContainer } from "./styles";

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
