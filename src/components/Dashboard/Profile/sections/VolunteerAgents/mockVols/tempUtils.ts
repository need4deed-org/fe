import { ApiVolunteerGetList, VolunteerStateEngagementType, VolunteerStateTypeType } from "need4deed-sdk";

import { TFunction } from "i18next";

const mapOpportunity = (volunteer: ApiVolunteerGetList) => {
  const newVolunteer = {
    activities: volunteer.activities,
    id: volunteer.id,
    avatarUrl: volunteer.avatarUrl,
    languages: volunteer.languages,
    locations: volunteer.locations,
    availability: volunteer.availability,
    skills: volunteer.skills,
    statusEngagement: volunteer.statusEngagement,
    statusType: volunteer.statusType,
    name: volunteer.name,
  };

  return newVolunteer;
};

export const getMappedOpportunities = (volunteers: ApiVolunteerGetList[]) => {
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
