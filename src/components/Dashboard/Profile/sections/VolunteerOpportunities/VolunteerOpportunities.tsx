import styled from "styled-components";
import { Tabs } from "./Tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// import { getMappedOpportunities } from "./mockOpps/tempUtils";
// import { mockRawOpportunities } from "./mockOpps/mockOpportunities";
import AccordionOpportunity from "./AccordionOpportunity";
import { apiPathVolunteer } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiVolunteerGet, ApiVolunteerOpportunityGet, OpportunityVolunteerStatusType } from "need4deed-sdk";

// const tabsKeys = ["pending", "matched", "active", "past"];
const tabsKeys = Object.values(OpportunityVolunteerStatusType);

interface Props {
  volunteer: ApiVolunteerGet;
}

export default function VolunteerOpportunities({ volunteer }: Props) {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabs = tabsKeys.map((key) => t(`dashboard.volunteerProfile.opportunitiesSec.status.${key}`));

  // const opportunities = getMappedOpportunities(mockRawOpportunities, t);

  const { data } = useGetQuery<ApiVolunteerOpportunityGet[]>({
    queryKey: ["volunteerOpportunities"],
    apiPath: `${apiPathVolunteer}${volunteer.id}/opportunity`,
  });
  const volunteerOpps = data || [];

  const groupVolunteerOpportunities = (volunteerOpps: ApiVolunteerOpportunityGet[]) => {
    const group: Record<ApiVolunteerOpportunityGet["status"], ApiVolunteerOpportunityGet[]> = {
      [OpportunityVolunteerStatusType.SUGGESTED]: [],
      [OpportunityVolunteerStatusType.MATCHED]: [],
      [OpportunityVolunteerStatusType.ACTIVE]: [],
      [OpportunityVolunteerStatusType.PAST]: [],
    };

    for (const opp of volunteerOpps) {
      if (group[opp.status]) group[opp.status].push(opp);
      else group[opp.status] = [opp];
    }

    return group;
  };

  const groupedOpportunities = groupVolunteerOpportunities(volunteerOpps);

  console.log("groupedOpportunities", groupedOpportunities);

  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {groupedOpportunities[tabsKeys[selectedTabIndex]].map((opportunity) => (
        <AccordionOpportunity key={opportunity.id} opportunity={opportunity} />
      ))}
    </VolunteerOpportunitiesContainer>
  );
}

/* Styles */

const VolunteerOpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;
