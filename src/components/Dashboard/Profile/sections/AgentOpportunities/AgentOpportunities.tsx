import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import AccordionOpportunity from "../VolunteerOpportunities/AccordionOpportunity";
import { mockRawOpportunities } from "../VolunteerOpportunities/mockOpps/mockOpportunities";
import { getMappedOpportunities } from "../VolunteerOpportunities/mockOpps/tempUtils";
import { Tabs } from "../shared/Tabs";
import { useTabTransitions } from "../shared/useTabTransitions";
import { AgentOpportunitiesContainer } from "./styles";

const tabsKeys = ["lookingForVolunteers", "active", "past"] as const;

const agentTabStatusOrder: OpportunityVolunteerStatusType[] = [
  OpportunityVolunteerStatusType.PENDING,
  OpportunityVolunteerStatusType.ACTIVE,
  OpportunityVolunteerStatusType.PAST,
];

const mockTabAssignment: Record<number, OpportunityVolunteerStatusType> = {
  0: OpportunityVolunteerStatusType.PENDING,
  1: OpportunityVolunteerStatusType.ACTIVE,
  2: OpportunityVolunteerStatusType.PAST,
};

export const AgentOpportunities = () => {
  const { t } = useTranslation();

  const opportunities = getMappedOpportunities(mockRawOpportunities, t, mockTabAssignment);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems } = useTabTransitions(
    opportunities,
    agentTabStatusOrder,
  );

  const tabs = tabsKeys.map((key, index) => ({
    label: t(`dashboard.agentProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[index],
  }));

  return (
    <AgentOpportunitiesContainer data-testid="agent-opportunities">
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleItems.map((opportunity) => (
        <AccordionOpportunity key={opportunity.id} opportunity={opportunity} currentStatus={currentTabStatus} />
      ))}
    </AgentOpportunitiesContainer>
  );
};
