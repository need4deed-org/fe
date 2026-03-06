import { Tabs } from "../shared/Tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getMappedOpportunities } from "./mockVols/tempUtils";
import { mockRawVolunteers } from "./mockVols/mockVolunteers";
import { AccordionVolunteer } from "./AccordionVolunteer";
import { VolunteerOpportunitiesContainer } from "./styles";

const tabsKeys = ["pending", "matched", "active", "past"] as const;
const tabCounts: Record<(typeof tabsKeys)[number], number | undefined> = {
  pending: 1,
  matched: 2,
  active: 0,
  past: undefined,
};

export const VolunteerAgents = () => {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const tabs = tabsKeys.map((key) => ({
    label: t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[key],
  }));

  const volunteers = getMappedOpportunities(mockRawVolunteers);
  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {volunteers?.length &&
        volunteers?.map((volunteer) => <AccordionVolunteer volunteer={volunteer} key={volunteer.id} />)}
    </VolunteerOpportunitiesContainer>
  );
};
