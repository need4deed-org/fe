import { OpportunityStatusType, QueryParamsKeys } from "need4deed-sdk";
import { OpportunityCardsFilter } from "./types";

export const defaultOpportunityCardsFilter: OpportunityCardsFilter = {
  [QueryParamsKeys.SEARCH]: "",
  [QueryParamsKeys.DISTRICT]: {},
  [QueryParamsKeys.LANGUAGE]: {},
  status: {
    [OpportunityStatusType.NEW]: false,
    [OpportunityStatusType.SEARCHING]: false,
    [OpportunityStatusType.ACTIVE]: false,
    [OpportunityStatusType.PAST]: false,
  },
};
