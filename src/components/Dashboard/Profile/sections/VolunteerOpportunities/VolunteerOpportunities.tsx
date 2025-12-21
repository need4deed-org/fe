import styled from "styled-components";
import { Tabs } from "./Tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const tabsKeys = ["pending", "matched", "active", "past"];

export default function VolunteerOpportunities() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabs = tabsKeys.map((key) => t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`));

  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
    </VolunteerOpportunitiesContainer>
  );
}

/* Styles */

const VolunteerOpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
