import { apiPathOpportunity, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { ApiVolunteerOpportunityGet, Id, OpportunityVolunteerStatusType, VolunteerStateTypeType } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
    volunteerType: v.volunteeringType as VolunteerStateTypeType,
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

  const { data, isLoading } = useGetQuery<ApiVolunteerOpportunityGet[]>({
    queryKey: ["opportunity-volunteers", String(opportunityId)],
    apiPath: `${apiPathOpportunity}/${opportunityId}/volunteer-linked`,
    staleTime: cacheTTL,
    enabled: !!opportunityId,
  });

  const volunteers = useMemo(() => (data ?? []).map(mapVolunteer), [data]);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(volunteers);

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
