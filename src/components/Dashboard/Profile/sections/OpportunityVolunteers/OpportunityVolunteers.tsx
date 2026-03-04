import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../VolunteerOpportunities/Tabs";
import { mockVolunteers } from "./mockVolunteers";
import { OpportunityVolunteersContainer } from "./styles";
import { VolunteerAccordion } from "./VolunteerAccordion";

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

  const tabs = tabKeys.map((key, index) => ({
    label: t(`dashboard.opportunityProfile.volunteersSec.tabs.${key}`),
    count: mockVolunteers.filter((v) => v.tabStatus === tabStatusOrder[index]).length,
  }));

  const visibleVolunteers = mockVolunteers.filter((v) => v.tabStatus === tabStatusOrder[selectedTabIndex]);

  return (
    <OpportunityVolunteersContainer data-testid="opportunity-volunteers">
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleVolunteers.length === 0 ? (
        <SectionEmptyState data-testid="volunteers-empty-state">
          {t("dashboard.opportunityProfile.volunteersSec.emptyState")}
        </SectionEmptyState>
      ) : (
        visibleVolunteers.map((volunteer) => <VolunteerAccordion key={volunteer.id} volunteer={volunteer} />)
      )}
    </OpportunityVolunteersContainer>
  );
};
