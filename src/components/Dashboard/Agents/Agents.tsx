"use client";

import { DashboardLayout } from "@/components/Layout";
import { AgentListController } from "./AgentListController";

export const Agents = () => {
  return (
    <DashboardLayout>
      <AgentListController />
    </DashboardLayout>
  );
};
