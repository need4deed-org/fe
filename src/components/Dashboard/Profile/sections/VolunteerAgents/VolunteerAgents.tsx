import styled from "styled-components";
import { Tabs } from "./Tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getMappedOpportunities } from "./mockOpps/tempUtils";
import { mockRawVolunteers } from "./mockOpps/mockVolunteers";
import AccordionVolunteer from "./AccordionVolunteer";

const tabsKeys = ["pending", "matched", "active", "past"];

export default function VolunteerAgents() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabs = tabsKeys.map((key) => t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`));

  const volunteers = getMappedOpportunities(mockRawVolunteers);
  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {volunteers?.length &&
        volunteers?.map((volunteer) => <AccordionVolunteer volunteer={volunteer} key={volunteer.id} />)}
    </VolunteerOpportunitiesContainer>
  );
}

/* Styles */

const VolunteerOpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;
