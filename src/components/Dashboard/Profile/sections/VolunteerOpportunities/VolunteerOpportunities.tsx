import styled from "styled-components";
import { Tabs } from "./Tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getMappedOpportunities } from "./mockOpps/tempUtils";
import { mockRawOpportunities } from "./mockOpps/mockOpportunities";
import AccordionOpportunity from "./AccordionOpportunity";

const tabsKeys = ["pending", "matched", "active", "past"];

export default function VolunteerOpportunities() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabs = tabsKeys.map((key) => t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`));

  const opportunities = getMappedOpportunities(mockRawOpportunities, t);

  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {/* opportunities will be grouped and render beneath each tab after fetching opps from API */}
      <AccordionOpportunity opportunity={opportunities[0]} />
      <AccordionOpportunity opportunity={opportunities[1]} />
      <AccordionOpportunity opportunity={opportunities[2]} />
    </VolunteerOpportunitiesContainer>
  );
}

/* Styles */

const VolunteerOpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;
