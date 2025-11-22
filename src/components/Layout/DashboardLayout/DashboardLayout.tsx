import { ReactNode } from "react";

import { DashboardBaseContainer } from "@/components/styled/container";

import { PageLayout } from "../PageLayout";
import NavigationBar from "./NavigationBar";

interface Props {
  children: ReactNode;
}
export function DashboardLayout({ children }: Props) {
  return (
    <PageLayout background="var(--color-white)">
      <NavigationBar />
      <DashboardBaseContainer>{children}</DashboardBaseContainer>
    </PageLayout>
  );
}
export default DashboardLayout;
