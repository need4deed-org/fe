import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import AccordionOpportunity from "../VolunteerOpportunities/AccordionOpportunity";
import { mockRawOpportunities } from "../VolunteerOpportunities/mockOpps/mockOpportunities";
import { getMappedOpportunities } from "../VolunteerOpportunities/mockOpps/tempUtils";
import { useTabTransitions } from "../shared/useTabTransitions";
import { Tabs } from "../shared/Tabs";
import { AgentOpportunitiesContainer } from "./styles";

const tabsKeys = ["lookingForVolunteers", "active", "past"] as const;

const mockTabAssignment: Record<number, OpportunityVolunteerStatusType> = {
  0: OpportunityVolunteerStatusType.SUGGESTED,
  1: OpportunityVolunteerStatusType.ACTIVE,
  2: OpportunityVolunteerStatusType.ACTIVE,
};

export const AgentOpportunities = () => {
  const { t } = useTranslation();

  const opportunities = getMappedOpportunities(mockRawOpportunities, t, mockTabAssignment);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(opportunities);

  const tabs = tabsKeys.map((key, index) => ({
    label: t(`dashboard.agentProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[index],
  }));

  const handleMatch = (id: number) => setItemStatus(id, OpportunityVolunteerStatusType.MATCHED);
  const handleNotAMatch = (id: number) => setItemStatus(id, "removed");
  const handleMarkAsActive = (id: number) => setItemStatus(id, OpportunityVolunteerStatusType.ACTIVE);
  const handleMarkAsPast = (id: number) => setItemStatus(id, OpportunityVolunteerStatusType.PAST);

  return (
    <AgentOpportunitiesContainer data-testid="agent-opportunities">
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleItems.map((opportunity) => (
        <AccordionOpportunity
          key={opportunity.id}
          opportunity={opportunity}
          currentStatus={currentTabStatus}
          onMatch={() => handleMatch(opportunity.id)}
          onNotAMatch={() => handleNotAMatch(opportunity.id)}
          onMarkAsActive={() => handleMarkAsActive(opportunity.id)}
          onMarkAsPast={() => handleMarkAsPast(opportunity.id)}
        />
      ))}
    </AgentOpportunitiesContainer>
  );
};
