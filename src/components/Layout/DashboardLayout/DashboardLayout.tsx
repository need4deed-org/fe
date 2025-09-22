import { ReactNode } from "react";
import { PageLayout } from "../PageLayout";
import NavigationBar from "./NavigationBar";
import { DashboardBaseContainer } from "@/components/styled/container";
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
