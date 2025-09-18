import { ReactNode } from "react";
import NavigationBar from "./NavigationBar";
import { DashboardBaseContainer } from "@/components/styled/container";

interface Props {
  children: ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <>
      <NavigationBar />
      <DashboardBaseContainer>{children}</DashboardBaseContainer>
    </>
  );
}

export default DashboardLayout;
