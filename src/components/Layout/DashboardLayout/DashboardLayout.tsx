import { DashboardBaseContainer } from "@/components/styled/container";
import { ReactNode } from "react";
import { PageLayout } from "../PageLayout";
import NavigationBar from "./NavigationBar";
interface Props {
  children: ReactNode;
  background?: string;
}
export function DashboardLayout({ children, background }: Props) {
  return (
    <PageLayout background={background || "var(--color-white)"}>
      <NavigationBar />
      <DashboardBaseContainer>{children}</DashboardBaseContainer>
    </PageLayout>
  );
}
export default DashboardLayout;
