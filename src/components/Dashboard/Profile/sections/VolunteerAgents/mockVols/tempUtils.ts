import {
  ApiVolunteerGetList,
  OpportunityVolunteerStatusType,
  VolunteerStateEngagementType,
  VolunteerStateTypeType,
} from "need4deed-sdk";

import { TFunction } from "i18next";

type VolunteerWithTabStatus = ApiVolunteerGetList & { tabStatus: OpportunityVolunteerStatusType };

const mapOpportunity = (volunteer: VolunteerWithTabStatus) => ({
  id: volunteer.id,
  name: volunteer.name,
  avatarUrl: volunteer.avatarUrl,
  languages: volunteer.languages,
  locations: volunteer.locations,
  availability: volunteer.availability,
  activities: volunteer.activities,
  skills: volunteer.skills,
  statusEngagement: volunteer.statusEngagement,
  statusType: volunteer.statusType,
  tabStatus: volunteer.tabStatus,
});

export type MappedVolunteerAgent = ReturnType<typeof mapOpportunity>;

export const getMappedOpportunities = (volunteers: VolunteerWithTabStatus[]) => {
  return volunteers.map((volunteer) => mapOpportunity(volunteer));
};

export const createEngagementStatusLabelMap = (t: TFunction): Record<VolunteerStateEngagementType, string> => ({
  [VolunteerStateEngagementType.NEW]: t("dashboard.volunteers.filters.engagement.new"),
  [VolunteerStateEngagementType.ACTIVE]: t("dashboard.volunteers.filters.engagement.active"),
  [VolunteerStateEngagementType.UNRESPONSIVE]: t("dashboard.volunteers.filters.engagement.unresponsive"),
  [VolunteerStateEngagementType.INACTIVE]: t("dashboard.volunteers.filters.engagement.inactive"),
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: t("dashboard.volunteers.filters.engagement.temporarilyUnavailable"),
  [VolunteerStateEngagementType.AVAILABLE]: t("dashboard.volunteers.filters.engagement.available"),
});

export const createStatusLabelMap = (t: TFunction): Record<VolunteerStateTypeType, string> => ({
  [VolunteerStateTypeType.ACCOMPANYING]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.accompanying",
  ),
  [VolunteerStateTypeType.EVENTS]: t("dashboard.volunteerProfile.volunteerHeader.volunteerType_options.events"),
  [VolunteerStateTypeType.REGULAR]: t("dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular"),
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular-accompanying",
  ),
});
