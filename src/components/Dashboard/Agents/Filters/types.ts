import { QueryParamsKeys } from "need4deed-sdk";
import { SelectionMap } from "../../common/CardsFilter/types";

export interface AgentCardsFilter {
  [QueryParamsKeys.SEARCH]: string;
  [QueryParamsKeys.DISTRICT]: SelectionMap;
  type: SelectionMap;
  volunteerSearch: SelectionMap;
  engagementStatus: SelectionMap;
  services: SelectionMap;
}

export type AgentCardFilterKeys = keyof AgentCardsFilter;
