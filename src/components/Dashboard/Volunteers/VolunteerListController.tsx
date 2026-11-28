import { useEffect } from "react";

import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { apiPathVolunteer, cacheTTL, CARD_LIMIT, TABLE_LIMIT } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import {
  ApiOptionLists,
  ApiVolunteerGetList,
  QueryParamsKeys,
  SortOrder,
  UserRole,
  VolunteerStateEngagementType,
} from "need4deed-sdk";
import { VolunteerCardsFilter } from "./Filters/types";
import { getCheckedOptionIds, serializeFilters } from "./helpers";
import { VolunteerCardList } from "./VolunteerCardList";
import { VolunteerTableList } from "./VolunteerTableList";
import { ViewMode } from "../common/types";
import { useCopyEmails } from "@/hooks/useCopyEmails";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { createVolunteerFilterSections } from "./Filters/helpers";
import { getSectionItems } from "../common/CardsFilter/selectionFilters";
import { useTranslation } from "react-i18next";
import { LoadingMapView } from "../common/MapView/LoadingMapView";
import { VolunteerMapView } from "./VolunteerMapView";
import { createSingleOpportunityMarker, hasUnsupportedDistrictMapFilter } from "../common/MapView/helpers";
import { SingleFilter } from "../common/MapView/types";

interface VolunteerListControllerProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
  filter: VolunteerCardsFilter;
  setFilter: (newFilter: VolunteerCardsFilter | ((prev: VolunteerCardsFilter) => VolunteerCardsFilter)) => void;
  apiFilterOptions?: ApiOptionLists;
  opportunityId?: string;
  viewMode: ViewMode;
  opportunityFilter: SingleFilter | undefined;
  defaultEngagements: VolunteerStateEngagementType[];
  ownerAgents?: string[];
}

export function VolunteerListController(props: VolunteerListControllerProps) {
  return <VolunteerListControllerContent key={props.viewMode} {...props} />;
}

function VolunteerListControllerContent({
  setNumOfVols,
  sortOrder,
  filter,
  setFilter,
  apiFilterOptions,
  opportunityId,
  viewMode,
  opportunityFilter,
  defaultEngagements,
  ownerAgents,
}: VolunteerListControllerProps) {
  const user = useCurrentUser();
  const isListView = viewMode === ViewMode.LIST;
  const isMapView = viewMode === ViewMode.MAP;
  const hasUnsupportedMapFilters =
    isMapView && (Boolean(filter.search) || hasUnsupportedDistrictMapFilter(filter.district));
  const hasNoOwnerAgents = ownerAgents?.length === 0;
  const limit = isListView ? TABLE_LIMIT : isMapView ? 1 : CARD_LIMIT;
  const { currentPage, setCurrentPage } = usePageParam();
  const { t, i18n } = useTranslation();
  const serializedFilter = serializeFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
    commuteSourceId: opportunityId,
  }) as URLSearchParams;
  const filterSections = createVolunteerFilterSections(filter, setFilter, t);
  const dropdownFilters = {
    typeFilters: getSectionItems(filterSections, "type"),
    languageFilters: getSectionItems(filterSections, QueryParamsKeys.LANGUAGE),
    matchAllLanguages: filter.matchAllLanguages ?? false,
    setMatchAllLanguages: (matchAllLanguages: boolean) => setFilter((prev) => ({ ...prev, matchAllLanguages })),
    districtFilters: getSectionItems(filterSections, QueryParamsKeys.DISTRICT),
    engagementFilters: getSectionItems(filterSections, QueryParamsKeys.ENGAGEMENT),
  };

  const selectedDistrictIds = getCheckedOptionIds(dropdownFilters.districtFilters, apiFilterOptions?.district);

  if (opportunityId) {
    serializedFilter.set("opportunity", opportunityId);
  }

  ownerAgents?.forEach((owner) => serializedFilter.append(QueryParamsKeys.OWNER_AGENT, owner));

  const emailsFilter = new URLSearchParams(serializedFilter);

  if (!serializedFilter.has(QueryParamsKeys.ENGAGEMENT)) {
    defaultEngagements.forEach((defaultEngagement) =>
      serializedFilter.append(QueryParamsKeys.ENGAGEMENT, defaultEngagement.replace(/^vol-/, "")),
    );
  }

  const params = {
    limit,
    page: currentPage,
    sortOrder,
    listType: isListView ? "table" : "card",
    filter: serializedFilter,
  };
  const { data, count, isLoading } = useGetQuery<ApiVolunteerGetList[]>({
    queryKey: ["volunteers"],
    apiPath: apiPathVolunteer,
    params,
    staleTime: cacheTTL,
    enabled: !hasNoOwnerAgents && (!isMapView || hasUnsupportedMapFilters),
    keepPreviousData: isMapView,
  });
  const volunteers = hasNoOwnerAgents ? [] : data || [];
  const volunteerCount = hasNoOwnerAgents ? 0 : count;
  const { handleCopyEmails, isCopying } = useCopyEmails(apiPathVolunteer, "volunteer-emails", emailsFilter);
  const canSeeContactColumns = user?.role === UserRole.COORDINATOR || user?.role === UserRole.ADMIN;

  const opportunityMarker = createSingleOpportunityMarker(opportunityFilter, t, i18n.language);

  useEffect(() => {
    if (!isMapView || hasUnsupportedMapFilters || hasNoOwnerAgents) setNumOfVols(volunteerCount);
  }, [volunteerCount, hasNoOwnerAgents, hasUnsupportedMapFilters, isMapView, setNumOfVols]);

  const isFetching = isLoading && !hasNoOwnerAgents;
  if (isFetching && isMapView) return <LoadingMapView />;
  if (isFetching && !isListView) return <DashboardListLoading />;

  if (isListView) {
    return (
      <VolunteerTableList
        isLoading={isFetching}
        volunteers={volunteers}
        count={volunteerCount}
        itemsPerPage={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        opportunityId={opportunityId}
        onCopyEmails={handleCopyEmails}
        isCopying={isCopying}
        canSeeContactColumns={canSeeContactColumns}
        selectedDistrictIds={selectedDistrictIds}
        dropdownFilters={dropdownFilters}
      />
    );
  }

  if (isMapView && !hasNoOwnerAgents) {
    return (
      <VolunteerMapView filter={serializedFilter} onCountChange={setNumOfVols} opportunityMarker={opportunityMarker} />
    );
  }

  return (
    <VolunteerCardList
      volunteers={volunteers}
      count={volunteerCount}
      itemsPerPage={limit}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      opportunityId={opportunityId}
      selectedDistrictIds={selectedDistrictIds}
    />
  );
}
