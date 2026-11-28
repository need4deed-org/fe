import { StatisticsGranularity, StatisticsGroupBy, StatisticsMetric } from "need4deed-sdk";

export interface MetricOption {
  metric: StatisticsMetric;
  labelKey: string;
  allTimeTotalsBy?: StatisticsGroupBy;
  noteKey?: string;
}

const SNAPSHOT_NOTE_KEY = "dashboard.admin.stats.snapshotNote";

export const METRIC_OPTIONS: MetricOption[] = [
  { metric: StatisticsMetric.NEW_VOLUNTEERS, labelKey: "dashboard.admin.stats.metric.newVolunteers" },
  { metric: StatisticsMetric.MATCHED_VOLUNTEERS, labelKey: "dashboard.admin.stats.metric.matchedVolunteers" },
  {
    metric: StatisticsMetric.ACTIVE_VOLUNTEERS,
    labelKey: "dashboard.admin.stats.metric.activeVolunteers",
    noteKey: SNAPSHOT_NOTE_KEY,
  },
  {
    metric: StatisticsMetric.AVAILABLE_VOLUNTEERS,
    labelKey: "dashboard.admin.stats.metric.availableVolunteers",
    noteKey: SNAPSHOT_NOTE_KEY,
  },
  { metric: StatisticsMetric.NEW_OPPORTUNITIES, labelKey: "dashboard.admin.stats.metric.newOpportunities" },
  {
    metric: StatisticsMetric.VALIDATED_OPPORTUNITIES,
    labelKey: "dashboard.admin.stats.metric.validatedOpportunities",
  },
  { metric: StatisticsMetric.MATCHED_OPPORTUNITIES, labelKey: "dashboard.admin.stats.metric.matchedOpportunities" },
  {
    metric: StatisticsMetric.UNMATCHED_OPPORTUNITIES,
    labelKey: "dashboard.admin.stats.metric.unmatchedOpportunities",
  },
  { metric: StatisticsMetric.PAST_OPPORTUNITIES, labelKey: "dashboard.admin.stats.metric.pastOpportunities" },
  {
    metric: StatisticsMetric.LEAD_FROM,
    labelKey: "dashboard.admin.stats.metric.leadFrom",
    allTimeTotalsBy: StatisticsGroupBy.LEAD_FROM,
  },
];

export const GRANULARITY_LABEL_KEYS: Record<StatisticsGranularity, string> = {
  [StatisticsGranularity.MONTH]: "dashboard.admin.stats.granularity.month",
  [StatisticsGranularity.QUARTER]: "dashboard.admin.stats.granularity.quarter",
  [StatisticsGranularity.YEAR]: "dashboard.admin.stats.granularity.year",
};

export const GROUP_BY_LABEL_KEYS: Record<StatisticsGroupBy, string> = {
  [StatisticsGroupBy.NONE]: "dashboard.admin.stats.groupBy.none",
  [StatisticsGroupBy.DISTRICT]: "dashboard.admin.stats.groupBy.district",
  [StatisticsGroupBy.OPPORTUNITY_TYPE]: "dashboard.admin.stats.groupBy.opportunityType",
  [StatisticsGroupBy.VOLUNTEER_TYPE]: "dashboard.admin.stats.groupBy.volunteerType",
  [StatisticsGroupBy.LEAD_FROM]: "dashboard.admin.stats.groupBy.leadFrom",
};

export const STATISTICS_MIN_YEAR = 2020;
