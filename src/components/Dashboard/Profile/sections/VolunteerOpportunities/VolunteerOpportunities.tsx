import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import {
  useDeleteOpportunityVolunteer,
  useUpdateOpportunityVolunteerStatus,
} from "@/hooks/useUpdateOpportunityVolunteerStatus";
import { ApiOpportunityVolunteerGet, Id, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
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

  const queryKey = ["volunteer-opportunities", String(volunteerId)];

  const { data, isLoading } = useGetQuery<ApiOpportunityVolunteerGet[]>({
    queryKey,
    apiPath: `${apiPathVolunteer}${volunteerId}/opportunity-linked`,
    staleTime: cacheTTL,
    enabled: !!volunteerId,
  });

  const opportunities = useMemo(() => (data ?? []).map(mapOpportunity), [data]);

  const { mutate: updateStatus } = useUpdateOpportunityVolunteerStatus(queryKey);
  const { mutate: deleteLink } = useDeleteOpportunityVolunteer(queryKey);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(opportunities);

  const findM2mId = useCallback(
    (opportunityId: number) => opportunities.find((o) => o.id === opportunityId)?.m2mId,
    [opportunities],
  );

  const tabs = tabsKeys.map((key, index) => ({
    label: t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[index],
  }));

  const handleMatch = (id: number) => {
    const m2mId = findM2mId(id);
    if (!m2mId) return;
    setItemStatus(id, OpportunityVolunteerStatusType.MATCHED);
    updateStatus({ m2mId, status: OpportunityVolunteerStatusType.MATCHED });
  };

  const handleNotAMatch = (id: number) => {
    const m2mId = findM2mId(id);
    if (!m2mId) return;
    setItemStatus(id, "removed");
    deleteLink({ m2mId });
  };

  const handleMarkAsActive = (id: number) => {
    const m2mId = findM2mId(id);
    if (!m2mId) return;
    setItemStatus(id, OpportunityVolunteerStatusType.ACTIVE);
    updateStatus({ m2mId, status: OpportunityVolunteerStatusType.ACTIVE });
  };

  const handleMarkAsPast = (id: number) => {
    const m2mId = findM2mId(id);
    if (!m2mId) return;
    setItemStatus(id, OpportunityVolunteerStatusType.PAST);
    updateStatus({ m2mId, status: OpportunityVolunteerStatusType.PAST });
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
