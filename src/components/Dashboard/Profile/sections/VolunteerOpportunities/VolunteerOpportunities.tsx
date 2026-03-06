import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SectionEmptyState } from "../shared/styles";
import AccordionOpportunity from "./AccordionOpportunity";
import { mockRawOpportunities } from "./mockOpps/mockOpportunities";
import { getMappedOpportunities } from "./mockOpps/tempUtils";
import { Tabs } from "../shared/Tabs";

const tabsKeys = ["pending", "matched", "active", "past"];

/**
 * Temporary tab assignment for mock opportunities until fetched from API.
 * Maps opportunity index → tab index (0=pending, 1=matched, 2=active, 3=past).
 */
const mockTabAssignment: Record<number, number> = { 0: 0, 1: 1, 2: 1 };

export default function VolunteerOpportunities() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const opportunities = getMappedOpportunities(mockRawOpportunities, t);

  const groupedByTab = tabsKeys.map((_, tabIndex) =>
    opportunities.filter((_, oppIndex) => (mockTabAssignment[oppIndex] ?? -1) === tabIndex),
  );

  const tabs = tabsKeys.map((key, index) => ({
    label: t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`),
    count: groupedByTab[index].length,
  }));

  const visibleOpportunities = groupedByTab[selectedTabIndex];

  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleOpportunities.length === 0 ? (
        <SectionEmptyState>{t("dashboard.opportunityProfile.volunteersSec.emptyState")}</SectionEmptyState>
      ) : (
        visibleOpportunities.map((opportunity) => (
          <AccordionOpportunity key={opportunity.id} opportunity={opportunity} />
        ))
      )}
    </VolunteerOpportunitiesContainer>
  );
}

/* Styles */

const VolunteerOpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;
