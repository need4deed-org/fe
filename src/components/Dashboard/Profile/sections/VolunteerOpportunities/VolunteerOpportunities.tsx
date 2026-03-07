import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { ApiOpportunityVolunteerGet, Id, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styled from "styled-components";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { useTabTransitions } from "../shared/useTabTransitions";
import AccordionOpportunity from "./AccordionOpportunity";
import { VolunteerLinkedOpportunity } from "./types";

const tabsKeys = ["pending", "matched", "active", "past"];

function mapOpportunity(o: ApiOpportunityVolunteerGet): VolunteerLinkedOpportunity {
  return {
    id: o.opportunityId,
    m2mId: o.id,
    opportunityId: o.opportunityId,
    title: o.title,
    appliedAt: new Date(o.updatedAt).toLocaleDateString("de-DE"),
    tabStatus: o.status,
  };
}

export default function VolunteerOpportunities({ volunteerId }: { volunteerId: Id }) {
  const { t } = useTranslation();

  const { data, isLoading } = useGetQuery<ApiOpportunityVolunteerGet[]>({
    queryKey: ["volunteer-opportunities", String(volunteerId)],
    apiPath: `${apiPathVolunteer}${volunteerId}/opportunity-linked`,
    staleTime: cacheTTL,
    enabled: !!volunteerId,
  });

  const opportunities = useMemo(() => (data ?? []).map(mapOpportunity), [data]);

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

  if (isLoading) {
    return <VolunteerOpportunitiesContainer />;
  }

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
