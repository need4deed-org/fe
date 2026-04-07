import { AgentEngagementStatusType, AgentVolunteerSearchType, QueryParamsKeys } from "need4deed-sdk";
import { AgentCardsFilter } from "./types";

export const defaultAgentCardsFilter: AgentCardsFilter = {
  [QueryParamsKeys.SEARCH]: "",
  [QueryParamsKeys.DISTRICT]: {},
  [QueryParamsKeys.LANGUAGE]: {},
  status: {
    [AgentEngagementStatusType.NEW]: false,
    [AgentEngagementStatusType.INACTIVE]: false,
    [AgentEngagementStatusType.ACTIVE]: false,
    [AgentEngagementStatusType.UNRESPONSIVE]: false,
  },
  volunteerSearch: {
    [AgentVolunteerSearchType.SEARCHING]: false,
    [AgentVolunteerSearchType.NOT_NEEDED]: false,
    [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: false,
  },
};
