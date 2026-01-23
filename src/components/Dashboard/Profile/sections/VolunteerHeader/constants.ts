import { TFunction } from "i18next";
import {
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";

export const createEngagementLabelMap = (
  t: TFunction,
): Record<VolunteerStateEngagementType, string> => ({
  [VolunteerStateEngagementType.NEW]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.new",
  ),
  [VolunteerStateEngagementType.ACTIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.active",
  ),
  [VolunteerStateEngagementType.AVAILABLE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.available",
  ),
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.tempUnavailable",
  ),
  [VolunteerStateEngagementType.INACTIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.inactive",
  ),
  [VolunteerStateEngagementType.UNRESPONSIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.unresponsive",
  ),
});

export const createMatchLabelMap = (
  t: TFunction,
): Record<VolunteerStateMatchType, string> => ({
  [VolunteerStateMatchType.NO_MATCHES]: t(
    "dashboard.volunteerProfile.volunteerHeader.matchStatus_options.noMatches",
  ),
  [VolunteerStateMatchType.PENDING_MATCH]: t(
    "dashboard.volunteerProfile.volunteerHeader.matchStatus_options.pendingMatch",
  ),
  [VolunteerStateMatchType.MATCHED]: t(
    "dashboard.volunteerProfile.volunteerHeader.matchStatus_options.matched",
  ),
  [VolunteerStateMatchType.NEEDS_REMATCH]: t(
    "dashboard.volunteerProfile.volunteerHeader.matchStatus_options.needsRematch",
  ),
});

export const createVolunteerTypeLabelMap = (
  t: TFunction,
): Record<VolunteerStateTypeType, string> => ({
  [VolunteerStateTypeType.ACCOMPANYING]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.accompanying",
  ),
  [VolunteerStateTypeType.REGULAR]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular",
  ),
  [VolunteerStateTypeType.EVENTS]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.events",
  ),
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular-accompanying",
  ),
});
