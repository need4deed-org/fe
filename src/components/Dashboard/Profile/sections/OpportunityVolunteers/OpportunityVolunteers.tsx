import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { mockVolunteers } from "./mockVolunteers";
import { OpportunityVolunteersContainer } from "./styles";
import { AccordionVolunteer } from "./AccordionVolunteer";

const tabStatusOrder: OpportunityVolunteerStatusType[] = [
  OpportunityVolunteerStatusType.SUGGESTED,
  OpportunityVolunteerStatusType.MATCHED,
  OpportunityVolunteerStatusType.ACTIVE,
  OpportunityVolunteerStatusType.PAST,
];

const tabKeys = ["pending", "matched", "active", "past"];

export const OpportunityVolunteers = () => {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [statusOverrides, setStatusOverrides] = useState<Record<number, OpportunityVolunteerStatusType | "removed">>(
    {},
  );

  const getStatus = (v: (typeof mockVolunteers)[0]) => statusOverrides[v.id] ?? v.tabStatus;

  const tabs = tabKeys.map((key, index) => ({
    label: t(`dashboard.opportunityProfile.volunteersSec.tabs.${key}`),
    count: mockVolunteers.filter((v) => getStatus(v) === tabStatusOrder[index]).length,
  }));

  const visibleVolunteers = mockVolunteers.filter((v) => getStatus(v) === tabStatusOrder[selectedTabIndex]);

  const handleMatch = (id: number) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: OpportunityVolunteerStatusType.MATCHED }));
    toast.success(t("dashboard.opportunityProfile.volunteersSec.matchSuccess"));
  };

  const handleNotAMatch = (id: number) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: "removed" }));
    toast.success(t("dashboard.opportunityProfile.volunteersSec.notAMatchSuccess"));
  };

  const handleMarkAsActive = (id: number) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: OpportunityVolunteerStatusType.ACTIVE }));
    toast.success(t("dashboard.opportunityProfile.volunteersSec.markAsActiveSuccess"));
  };

  const handleMarkAsPast = (id: number) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: OpportunityVolunteerStatusType.PAST }));
    toast.success(t("dashboard.opportunityProfile.volunteersSec.markAsPastSuccess"));
  };

  return (
    <OpportunityVolunteersContainer data-testid="opportunity-volunteers">
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleVolunteers.length === 0 ? (
        <SectionEmptyState data-testid="volunteers-empty-state">
          {t("dashboard.opportunityProfile.volunteersSec.emptyState")}
        </SectionEmptyState>
      ) : (
        visibleVolunteers.map((volunteer) => (
          <AccordionVolunteer
            key={volunteer.id}
            volunteer={volunteer}
            currentStatus={tabStatusOrder[selectedTabIndex]}
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
