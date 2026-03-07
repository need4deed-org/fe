import { OpportunityVolunteerStatusType } from "need4deed-sdk";

const datePrefixKeys: Record<OpportunityVolunteerStatusType, string> = {
  [OpportunityVolunteerStatusType.SUGGESTED]: "dashboard.common.datePrefix.appliedOn",
  [OpportunityVolunteerStatusType.MATCHED]: "dashboard.common.datePrefix.matchedOn",
  [OpportunityVolunteerStatusType.ACTIVE]: "dashboard.common.datePrefix.activeSince",
  [OpportunityVolunteerStatusType.PAST]: "dashboard.common.datePrefix.pastSince",
};

export const getDatePrefixKey = (status: OpportunityVolunteerStatusType): string =>
  datePrefixKeys[status] ?? "dashboard.common.datePrefix.appliedOn";
