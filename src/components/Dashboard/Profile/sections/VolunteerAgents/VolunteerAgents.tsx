import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { useTabTransitions } from "../shared/useTabTransitions";
import { AccordionVolunteer } from "./AccordionVolunteer";
import { mockRawVolunteers } from "./mockVols/mockVolunteers";
import { getMappedOpportunities } from "./mockVols/tempUtils";
import { VolunteerOpportunitiesContainer } from "./styles";

const tabsKeys = ["pending", "matched", "active", "past"] as const;

export const VolunteerAgents = () => {
  const { t } = useTranslation();

  const volunteers = getMappedOpportunities(mockRawVolunteers);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(volunteers);

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
        visibleItems.map((volunteer) => (
          <AccordionVolunteer
            key={volunteer.id}
            volunteer={volunteer}
            currentStatus={currentTabStatus}
            onMatch={() => handleMatch(volunteer.id)}
            onNotAMatch={() => handleNotAMatch(volunteer.id)}
            onMarkAsActive={() => handleMarkAsActive(volunteer.id)}
            onMarkAsPast={() => handleMarkAsPast(volunteer.id)}
          />
        ))
      )}
    </VolunteerOpportunitiesContainer>
  );
};
