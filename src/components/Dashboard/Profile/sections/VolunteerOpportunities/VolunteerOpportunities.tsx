import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styled from "styled-components";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { useTabTransitions } from "../shared/useTabTransitions";
import AccordionOpportunity from "./AccordionOpportunity";
import { mockRawOpportunities } from "./mockOpps/mockOpportunities";
import { getMappedOpportunities } from "./mockOpps/tempUtils";

const tabsKeys = ["pending", "matched", "active", "past"];

const mockTabAssignment: Record<number, OpportunityVolunteerStatusType> = {
  0: OpportunityVolunteerStatusType.SUGGESTED,
  1: OpportunityVolunteerStatusType.MATCHED,
  2: OpportunityVolunteerStatusType.MATCHED,
};

export default function VolunteerOpportunities() {
  const { t } = useTranslation();

  const opportunities = getMappedOpportunities(mockRawOpportunities, t, mockTabAssignment);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(opportunities);

  const tabs = tabsKeys.map((key, index) => ({
    label: t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[index],
  }));

  const handleMatch = (id: number) => {
    setItemStatus(id, OpportunityVolunteerStatusType.MATCHED);
    toast.success(t("dashboard.volunteerProfile.opportunitiesSec.matchSuccess"));
  };

  const handleNotAMatch = (id: number) => {
    setItemStatus(id, "removed");
    toast.success(t("dashboard.volunteerProfile.opportunitiesSec.notAMatchSuccess"));
  };

  const handleMarkAsActive = (id: number) => {
    setItemStatus(id, OpportunityVolunteerStatusType.ACTIVE);
    toast.success(t("dashboard.volunteerProfile.opportunitiesSec.markAsActiveSuccess"));
  };

  const handleMarkAsPast = (id: number) => {
    setItemStatus(id, OpportunityVolunteerStatusType.PAST);
    toast.success(t("dashboard.volunteerProfile.opportunitiesSec.markAsPastSuccess"));
  };

  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleItems.length === 0 ? (
        <SectionEmptyState>{t("dashboard.volunteerProfile.opportunitiesSec.emptyState")}</SectionEmptyState>
      ) : (
        visibleItems.map((opportunity) => (
          <AccordionOpportunity
            key={opportunity.id}
            opportunity={opportunity}
            currentStatus={currentTabStatus}
            onMatch={() => handleMatch(opportunity.id)}
            onNotAMatch={() => handleNotAMatch(opportunity.id)}
            onMarkAsActive={() => handleMarkAsActive(opportunity.id)}
            onMarkAsPast={() => handleMarkAsPast(opportunity.id)}
          />
        ))
      )}
    </VolunteerOpportunitiesContainer>
  );
}

const VolunteerOpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;
