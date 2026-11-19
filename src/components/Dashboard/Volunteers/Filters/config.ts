import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";
import { SelectionFilterConfigs } from "../../common/CardsFilter/selectionFilters";
import { VolunteerCardsFilter, VolunteerStatusMatch } from "./types";

// The backend re-adds the "vol-" prefix (engagementWorkaround), so it's stripped from params.
const VOL_PREFIX = "vol-";
const stripVolPrefix = (value: string) => value.replace(/^vol-/, "");
const addVolPrefix = (param: string) => `${VOL_PREFIX}${param}`;

export const volunteerFilterConfigs: SelectionFilterConfigs<VolunteerCardsFilter> = {
  type: {
    header: "dashboard.volunteers.filters.volunteerType_title",
    label: (value, t) => t(`dashboard.volunteers.filters.volunteerType_options.${value}`),
  },
  [QueryParamsKeys.ENGAGEMENT]: {
    header: "dashboard.volunteers.filters.engagement.header",
    label: (value, t) => t(`dashboard.volunteers.filters.engagement.${value}`),
    toParam: stripVolPrefix,
    fromParam: addVolPrefix,
  },
  [VolunteerStatusMatch.MATCH]: {
    header: "dashboard.volunteers.filters.matchStatus.header",
    label: (value, t) => t(`dashboard.volunteers.filters.matchStatus.${value}`),
    toParam: stripVolPrefix,
    fromParam: addVolPrefix,
  },
  [QueryParamsKeys.DISTRICT]: {
    header: "dashboard.volunteers.filters.district",
    option: EntityTableName.DISTRICT,
  },
  [QueryParamsKeys.LANGUAGE]: {
    header: "dashboard.volunteers.filters.languages",
    option: EntityTableName.LANGUAGE,
  },
  [EntityTableName.ACTIVITY]: {
    header: "dashboard.volunteers.filters.activities",
    option: EntityTableName.ACTIVITY,
  },
};
