import { ReactNode } from "react";
import { AppNavigation } from "@/components/navigation/AppNavigation";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AppLayout({ children }: AppLayoutProps) {
  return <AppNavigation>{children}</AppNavigation>;
}
