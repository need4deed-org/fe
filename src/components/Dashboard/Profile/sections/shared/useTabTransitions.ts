import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useState } from "react";

export const TAB_STATUS_ORDER: OpportunityVolunteerStatusType[] = [
  OpportunityVolunteerStatusType.SUGGESTED,
  OpportunityVolunteerStatusType.MATCHED,
  OpportunityVolunteerStatusType.ACTIVE,
  OpportunityVolunteerStatusType.PAST,
];

type StatusOverride = OpportunityVolunteerStatusType | "removed";

export function useTabTransitions<T extends { id: number; tabStatus: OpportunityVolunteerStatusType }>(items: T[]) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [statusOverrides, setStatusOverrides] = useState<Record<number, StatusOverride>>({});

  const getEffectiveStatus = (item: T): StatusOverride => statusOverrides[item.id] ?? item.tabStatus;

  const currentTabStatus = TAB_STATUS_ORDER[selectedTabIndex];

  const tabCounts = TAB_STATUS_ORDER.map(
    (status) => items.filter((item) => getEffectiveStatus(item) === status).length,
  );

  const visibleItems = items.filter((item) => getEffectiveStatus(item) === currentTabStatus);

  const setItemStatus = (id: number, status: StatusOverride) =>
    setStatusOverrides((prev) => ({ ...prev, [id]: status }));

  return { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus };
}
