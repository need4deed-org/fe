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
  [VolunteerStateEngagementType.NEW]: t("dashboard.volunteers.filters.engagement.vol-new"),
  [VolunteerStateEngagementType.ACTIVE]: t("dashboard.volunteers.filters.engagement.vol-active"),
  [VolunteerStateEngagementType.UNRESPONSIVE]: t("dashboard.volunteers.filters.engagement.vol-unresponsive"),
  [VolunteerStateEngagementType.INACTIVE]: t("dashboard.volunteers.filters.engagement.vol-inactive"),
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: t("dashboard.volunteers.filters.engagement.vol-temp-unavailable"),
  [VolunteerStateEngagementType.AVAILABLE]: t("dashboard.volunteers.filters.engagement.vol-available"),
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
