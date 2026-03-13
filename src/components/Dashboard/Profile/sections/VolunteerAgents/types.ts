import {
  ApiVolunteerGetList,
  OpportunityVolunteerStatusType,
  VolunteerStateEngagementType,
  VolunteerStateTypeType,
} from "need4deed-sdk";

import { TFunction } from "i18next";

export type MappedVolunteerAgent = ApiVolunteerGetList & {
  status: OpportunityVolunteerStatusType;
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
