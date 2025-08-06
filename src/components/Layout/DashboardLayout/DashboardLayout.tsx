import React, { ReactNode } from "react";
import NavigationBar from "@/components/Dashboard/NavigationBar";
import { PageLayout } from "../PageLayout";

interface Props {
  children: ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <PageLayout background="var(--color-white)">
      <NavigationBar />
      {children}
    </PageLayout>
  );
}

export default DashboardLayout;
