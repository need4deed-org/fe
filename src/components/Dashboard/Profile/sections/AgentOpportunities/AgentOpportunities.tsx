import { useState } from "react";
import { useTranslation } from "react-i18next";
import AccordionOpportunity from "../VolunteerOpportunities/AccordionOpportunity";
import { mockRawOpportunities } from "../VolunteerOpportunities/mockOpps/mockOpportunities";
import { getMappedOpportunities } from "../VolunteerOpportunities/mockOpps/tempUtils";
import { Tabs } from "../shared/Tabs";
import { AgentOpportunitiesContainer } from "./styles";

const tabsKeys = ["lookingForVolunteers", "active", "past"] as const;
const tabCounts: Record<(typeof tabsKeys)[number], number | undefined> = {
  lookingForVolunteers: 1,
  active: 2,
  past: undefined,
};

export const AgentOpportunities = () => {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const tabs = tabsKeys.map((key) => ({
    label: t(`dashboard.agentProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[key],
  }));

  const opportunities = getMappedOpportunities(mockRawOpportunities, t);

  return (
    <AgentOpportunitiesContainer data-testid="agent-opportunities">
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      <AccordionOpportunity opportunity={opportunities[0]} />
      <AccordionOpportunity opportunity={opportunities[1]} />
      <AccordionOpportunity opportunity={opportunities[2]} />
    </AgentOpportunitiesContainer>
  );
};
