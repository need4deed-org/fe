import { TFunction } from "i18next";
import { OpportunityStatusType } from "need4deed-sdk";

export enum OpportunityManualStatusType {
  NEW = "opp-new",
  SEARCHING = "opp-searching",
  CANCELLED_BY_US = "opp-cancelled-by-us",
  CANCELLED_BY_NGO = "opp-cancelled-by-ngo",
  MATCHED_NOT_NEEDED = "opp-matched-not-needed",
  MATCHED_VOLUNTEER_NO_SHOW = "opp-matched-volunteer-no-show",
}

export const SDK_TO_MANUAL: Partial<Record<OpportunityStatusType, OpportunityManualStatusType>> = {
  [OpportunityStatusType.NEW]: OpportunityManualStatusType.NEW,
  [OpportunityStatusType.SEARCHING]: OpportunityManualStatusType.SEARCHING,
};

export const MANUAL_TO_SDK: Partial<Record<OpportunityManualStatusType, OpportunityStatusType>> = {
  [OpportunityManualStatusType.NEW]: OpportunityStatusType.NEW,
  [OpportunityManualStatusType.SEARCHING]: OpportunityStatusType.SEARCHING,
};

export const STATUS_DESCRIPTION_KEYS: Record<OpportunityManualStatusType, string> = {
  [OpportunityManualStatusType.NEW]: "new_description",
  [OpportunityManualStatusType.SEARCHING]: "searching_description",
  [OpportunityManualStatusType.CANCELLED_BY_US]: "cancelledByUs_description",
  [OpportunityManualStatusType.CANCELLED_BY_NGO]: "cancelledByNGO_description",
  [OpportunityManualStatusType.MATCHED_NOT_NEEDED]: "matchedNotNeeded_description",
  [OpportunityManualStatusType.MATCHED_VOLUNTEER_NO_SHOW]: "matchedVolunteerNoShow_description",
};

export const createOpportunityStatusLabelMap = (t: TFunction): Record<OpportunityManualStatusType, string> => ({
  [OpportunityManualStatusType.NEW]: t("dashboard.opportunityProfile.statusModal.options.new"),
  [OpportunityManualStatusType.SEARCHING]: t("dashboard.opportunityProfile.statusModal.options.searching"),
  [OpportunityManualStatusType.CANCELLED_BY_US]: t("dashboard.opportunityProfile.statusModal.options.cancelledByUs"),
  [OpportunityManualStatusType.CANCELLED_BY_NGO]: t("dashboard.opportunityProfile.statusModal.options.cancelledByNGO"),
  [OpportunityManualStatusType.MATCHED_NOT_NEEDED]: t(
    "dashboard.opportunityProfile.statusModal.options.matchedNotNeeded",
  ),
  [OpportunityManualStatusType.MATCHED_VOLUNTEER_NO_SHOW]: t(
    "dashboard.opportunityProfile.statusModal.options.matchedVolunteerNoShow",
  ),
});
