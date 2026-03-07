import { useTranslation } from "react-i18next";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { useTabTransitions } from "../shared/useTabTransitions";
import { VolunteerOpportunitiesContainer } from "./styles";
import { MappedVolunteerAgent } from "./types";

const agentTabStatusOrder = ["pending", "matched", "active", "past"] as const;

export const VolunteerAgents = () => {
  const { t } = useTranslation();

  const { selectedTabIndex, setSelectedTabIndex, tabCounts } = useTabTransitions<MappedVolunteerAgent>([]);

  const tabs = agentTabStatusOrder.map((key, index) => ({
    label: t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[index],
  }));

  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      <SectionEmptyState>{t("dashboard.volunteerProfile.opportunitiesSec.emptyState")}</SectionEmptyState>
    </VolunteerOpportunitiesContainer>
  );
};
