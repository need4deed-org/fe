import { TFunction } from "i18next";
import { OpportunityStatusType } from "need4deed-sdk";

export enum OpportunityManualStatusType {
  NEW = "opp-new",
  SEARCHING = "opp-searching",
  INACTIVE = "opp-inactive",
}

export const SDK_TO_MANUAL: Partial<Record<OpportunityStatusType, OpportunityManualStatusType>> = {
  [OpportunityStatusType.NEW]: OpportunityManualStatusType.NEW,
  [OpportunityStatusType.SEARCHING]: OpportunityManualStatusType.SEARCHING,
};

export const MANUAL_TO_SDK: Partial<Record<OpportunityManualStatusType, OpportunityStatusType>> = {
  [OpportunityManualStatusType.NEW]: OpportunityStatusType.NEW,
  [OpportunityManualStatusType.SEARCHING]: OpportunityStatusType.SEARCHING,
  [OpportunityManualStatusType.INACTIVE]: OpportunityStatusType.PAST,
};

export const STATUS_DESCRIPTION_KEYS: Record<OpportunityManualStatusType, string> = {
  [OpportunityManualStatusType.NEW]: "new_description",
  [OpportunityManualStatusType.SEARCHING]: "searching_description",
  [OpportunityManualStatusType.INACTIVE]: "inactive_description",
};

export const createOpportunityStatusLabelMap = (t: TFunction): Record<OpportunityManualStatusType, string> => ({
  [OpportunityManualStatusType.NEW]: t("dashboard.opportunityProfile.statusModal.options.new"),
  [OpportunityManualStatusType.SEARCHING]: t("dashboard.opportunityProfile.statusModal.options.searching"),
  [OpportunityManualStatusType.INACTIVE]: t("dashboard.opportunityProfile.statusModal.options.inactive"),
});
