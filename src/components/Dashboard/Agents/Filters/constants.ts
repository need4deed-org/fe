import {
  AgentEngagementStatusType,
  AgentServiceType,
  AgentType,
  AgentVolunteerSearchType,
  QueryParamsKeys,
} from "need4deed-sdk";
import { AgentCardsFilter } from "./types";

export const defaultAgentCardsFilter: AgentCardsFilter = {
  [QueryParamsKeys.SEARCH]: "",
  [QueryParamsKeys.DISTRICT]: {},
  type: {
    [AgentType.AE]: false,
    [AgentType.ASOG]: false,
    [AgentType.COUNSELING_CENTER]: false,
    [AgentType.GU1]: false,
    [AgentType.GU2]: false,
    [AgentType.GU2_PLUS]: false,
    [AgentType.GU3]: false,
    [AgentType.MULTIPLE_SOCIAL_SUPPORT]: false,
    [AgentType.NU]: false,
    [AgentType.TANDEM]: false,
  },
  volunteerSearch: {
    [AgentVolunteerSearchType.SEARCHING]: false,
    [AgentVolunteerSearchType.NOT_NEEDED]: false,
    [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: false,
  },
  engagementStatus: {
    [AgentEngagementStatusType.NEW]: false,
    [AgentEngagementStatusType.INACTIVE]: false,
    [AgentEngagementStatusType.ACTIVE]: false,
    [AgentEngagementStatusType.UNRESPONSIVE]: false,
  },
  services: {
    [AgentServiceType.CHILDCARE]: false,
    [AgentServiceType.CONSULTATION]: false,
    [AgentServiceType.JOB_COACHING]: false,
    [AgentServiceType.REFUGEE_ACCOMMODATION]: false,
    [AgentServiceType.SPORT]: false,
    [AgentServiceType.TANDEM]: false,
    [AgentServiceType.TUTORING]: false,
    [AgentServiceType.VOLUNTARY_SUPPORT]: false,
    [AgentServiceType.WELFARE]: false,
    [AgentServiceType.YOUTH]: false,
  },
};
