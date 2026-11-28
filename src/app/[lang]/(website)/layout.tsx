import { ReactNode } from "react";
import { WebsiteNavigation } from "@/components/navigation/WebsiteNavigation";

type WebsiteLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return <WebsiteNavigation>{children}</WebsiteNavigation>;
}
