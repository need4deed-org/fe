import React, { ReactNode } from "react";
import { PageLayout } from "../PageLayout";
import NavigationBar from "./NavigationBar";

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
