import { apiPathOpportunity, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import {
  useDeleteOpportunityVolunteer,
  useUpdateOpportunityVolunteerStatus,
} from "@/hooks/useUpdateOpportunityVolunteerStatus";
import { ApiVolunteerOpportunityGet, Id, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { useTabTransitions } from "../shared/useTabTransitions";
import { AccordionVolunteer } from "./AccordionVolunteer";
import { OpportunityVolunteersContainer } from "./styles";
import { OpportunityLinkedVolunteer } from "./types";

const tabKeys = ["pending", "matched", "active", "past"];

function mapVolunteer(v: ApiVolunteerOpportunityGet): OpportunityLinkedVolunteer {
  return {
    id: v.volunteerId,
    m2mId: v.id,
    name: v.name,
    avatarUrl: v.avatarUrl,
    engagementStatus: v.engagement,
    volunteerType: v.volunteeringType,
    appliedAt: new Date(v.updatedAt).toLocaleDateString("de-DE"),
    tabStatus: v.status,
    languages: v.languages.map((l) => ({ title: l.title, proficiency: l.proficiency })),
    activities: v.activities.map((a) => a.title),
    skills: v.skills.map((s) => s.title),
    availability: v.availability.map((a) => [a.day, a.daytime].filter(Boolean).join(" ")).join(", ") || "–",
    locations: v.locations.map((l) => l.title),
  };
}

export const OpportunityVolunteers = ({ opportunityId }: { opportunityId: Id }) => {
  const { t } = useTranslation();

  const queryKey = ["opportunity-volunteers", String(opportunityId)];

  const { data, isLoading } = useGetQuery<ApiVolunteerOpportunityGet[]>({
    queryKey,
    apiPath: `${apiPathOpportunity}/${opportunityId}/volunteer-linked`,
    staleTime: cacheTTL,
    enabled: !!opportunityId,
  });

  const volunteers = useMemo(() => (data ?? []).map(mapVolunteer), [data]);

  const { mutate: updateStatus } = useUpdateOpportunityVolunteerStatus(queryKey);
  const { mutate: deleteLink } = useDeleteOpportunityVolunteer(queryKey);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(volunteers);

  const findM2mId = useCallback(
    (volunteerId: number) => volunteers.find((v) => v.id === volunteerId)?.m2mId,
    [volunteers],
  );

  const tabs = tabKeys.map((key, index) => ({
    label: t(`dashboard.opportunityProfile.volunteersSec.tabs.${key}`),
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
    return <OpportunityVolunteersContainer data-testid="opportunity-volunteers" />;
  }

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
