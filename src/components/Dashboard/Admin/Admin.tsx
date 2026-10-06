"use client";

import { DashboardLayout } from "@/components/Layout";
import { questionMark } from "@/config/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { HyphenatedHeading2 } from "../common/CardsHeader/styles";
import { HeaderTabs } from "../common/HeaderTabs";
import { StatisticsTab } from "./StatisticsTab";
import { TrustedDomainsTab } from "./TrustedDomainsTab";

enum AdminView {
  DOMAINS = "domains",
  STATS = "stats",
}

const VIEW_BY_TAB = [AdminView.DOMAINS, AdminView.STATS];

export function Admin() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [t("dashboard.admin.tabs.domains"), t("dashboard.admin.tabs.stats")];
  const foundIndex = VIEW_BY_TAB.findIndex((view) => view === searchParams.get("view"));
  const selectedTabIndex = foundIndex === -1 ? 0 : foundIndex;

  const handleTabChange = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", VIEW_BY_TAB[index] ?? AdminView.DOMAINS);
    router.push(pathname + questionMark + params.toString());
  };

  return (
    <DashboardLayout>
      <AdminContainer>
        <HeaderContainer>
          <HyphenatedHeading2>{t("dashboard.admin.title")}</HyphenatedHeading2>
          <HeaderTabs tabs={tabs} selectedTabIndex={selectedTabIndex} onTabChange={handleTabChange} />
        </HeaderContainer>
        {VIEW_BY_TAB[selectedTabIndex] === AdminView.STATS ? <StatisticsTab /> : <TrustedDomainsTab />}
      </AdminContainer>
    </DashboardLayout>
  );
}

export default Admin;

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-container-gap);
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-title-tabs-gap);
`;
