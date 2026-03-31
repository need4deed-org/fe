import { QueryParamsKeys } from "need4deed-sdk";
import { SelectionMap } from "../../common/CardsFilter/types";

export interface OpportunityCardsFilter {
  [QueryParamsKeys.SEARCH]: string;
  [QueryParamsKeys.DISTRICT]: SelectionMap;
  [QueryParamsKeys.LANGUAGE]: SelectionMap;
  status: SelectionMap;
}

export type OpportunityCardFilterKeys = keyof OpportunityCardsFilter;
