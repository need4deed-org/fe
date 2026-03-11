import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { useTabTransitions } from "../shared/useTabTransitions";
import { AgentOpportunitiesContainer } from "./styles";

const tabsKeys = ["lookingForVolunteers", "active", "past"] as const;

const agentTabStatusOrder: OpportunityVolunteerStatusType[] = [
  OpportunityVolunteerStatusType.PENDING,
  OpportunityVolunteerStatusType.ACTIVE,
  OpportunityVolunteerStatusType.PAST,
];

export const AgentOpportunities = () => {
  const { t } = useTranslation();

  const { selectedTabIndex, setSelectedTabIndex, tabCounts } = useTabTransitions([], agentTabStatusOrder);

  const tabs = tabsKeys.map((key, index) => ({
    label: t(`dashboard.agentProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[index],
  }));

  return (
    <AgentOpportunitiesContainer data-testid="agent-opportunities">
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      <SectionEmptyState>{t("dashboard.volunteerProfile.opportunitiesSec.emptyState")}</SectionEmptyState>
    </AgentOpportunitiesContainer>
  );
};
