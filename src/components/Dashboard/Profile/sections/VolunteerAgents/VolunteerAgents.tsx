import { useTranslation } from "react-i18next";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { TAB_STATUS_ORDER, useTabTransitions } from "../shared/useTabTransitions";
import { VolunteerOpportunitiesContainer } from "./styles";
import { MappedVolunteerAgent } from "./types";

export const VolunteerAgents = () => {
  const { t } = useTranslation();

  const { selectedTabIndex, setSelectedTabIndex, tabCounts } = useTabTransitions<MappedVolunteerAgent>([]);

  const tabs = TAB_STATUS_ORDER.map((key, index) => ({
    label: t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[index],
  }));

  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      <SectionEmptyState>{t("dashboard.volunteerProfile.opportunitiesSec.emptyState")}</SectionEmptyState>
    </VolunteerOpportunitiesContainer>
  );
};
