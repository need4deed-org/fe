import { ReactNode } from "react";
import { PageLayout } from "../PageLayout";
import NavigationBar from "./NavigationBar";
import { DashboardBaseContainer } from "@/components/styled/container";
interface Props {
  children: ReactNode;
  background?: string;
}
export function DashboardLayout({ children, background = "var(--color-white)" }: Props) {
  return (
    <PageLayout background={background}>
      <NavigationBar />
      <DashboardBaseContainer>{children}</DashboardBaseContainer>
    </PageLayout>
  );
}
export default DashboardLayout;
