import { TFunction } from "i18next";
import { VolunteerStateCommunicationType, VolunteerStateTypeType } from "need4deed-sdk";

const ACCOMPANYING_TYPES = [VolunteerStateTypeType.ACCOMPANYING, VolunteerStateTypeType.REGULAR_ACCOMPANYING];

export const isBriefedAccompanying = (
  statusType: VolunteerStateTypeType | undefined,
  statusCommunication: VolunteerStateCommunicationType | undefined,
): boolean =>
  !!statusType &&
  ACCOMPANYING_TYPES.includes(statusType) &&
  statusCommunication === VolunteerStateCommunicationType.BRIEFED;

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
