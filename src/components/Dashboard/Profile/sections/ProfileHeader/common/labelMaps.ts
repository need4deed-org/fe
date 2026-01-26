import { TFunction } from "i18next";
import { VolunteerStateTypeType } from "need4deed-sdk";

export const createVolunteerTypeLabelMap = (t: TFunction): Record<VolunteerStateTypeType, string> => ({
  [VolunteerStateTypeType.ACCOMPANYING]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.accompanying",
  ),
  [VolunteerStateTypeType.REGULAR]: t("dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular"),
  [VolunteerStateTypeType.EVENTS]: t("dashboard.volunteerProfile.volunteerHeader.volunteerType_options.events"),
  [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: t(
    "dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular-accompanying",
  ),
});
