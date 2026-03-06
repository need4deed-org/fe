import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { useTabTransitions } from "../shared/useTabTransitions";
import { mockVolunteers } from "./mockVolunteers";
import { OpportunityVolunteersContainer } from "./styles";
import { AccordionVolunteer } from "./AccordionVolunteer";

const tabKeys = ["pending", "matched", "active", "past"];

export const OpportunityVolunteers = () => {
  const { t } = useTranslation();
  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(mockVolunteers);

  const tabs = tabKeys.map((key, index) => ({
    label: t(`dashboard.opportunityProfile.volunteersSec.tabs.${key}`),
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
    <OpportunityVolunteersContainer data-testid="opportunity-volunteers">
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleItems.length === 0 ? (
        <SectionEmptyState data-testid="volunteers-empty-state">
          {t("dashboard.opportunityProfile.volunteersSec.emptyState")}
        </SectionEmptyState>
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
    </OpportunityVolunteersContainer>
  );
};
