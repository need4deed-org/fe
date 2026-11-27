"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { DashboardLayout } from "@/components/Layout";
import {
  apiPathOption,
  DEFAULT_MAX_COMMUTE_MINUTES,
  questionMark,
  ScreenTypes,
  USER_QUERY_KEY,
} from "@/config/constants";
import { useGetOpportunity, useGetQuery } from "@/hooks";
import {
  ApiOptionLists,
  LangPurpose,
  ProfileVolunteeringType,
  QueryParamsKeys,
  SortOrder,
  UserRole,
  VolunteerStateEngagementType,
} from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { EMPTY_LIST, getClearFilter, getClearSingleFilter } from "../common/CardsFilter/helpers";
import {
  applyMatchingPrefill,
  clearCommutePrefill,
  hasFilterParams,
  PREFILLED_PARAM,
  withPrefilledMarker,
} from "../common/CardsFilter/matchingPrefill";
import { withOptionFilters } from "../common/CardsFilter/selectionFilters";
import { volunteerFilterConfigs } from "./Filters/config";
import {
  DEFAULT_NGO_VOLUNTEER_ENGAGEMENTS,
  DEFAULT_STAFF_VOLUNTEER_ENGAGEMENTS,
  DEFAULT_VOLUNTEER_ENGAGEMENTS,
  defaultVolunteerCardsFilter,
} from "./Filters/constants";
import FiltersContent from "./Filters/FiltersContent";
import { VolunteerCardsFilter } from "./Filters/types";
import { createSelectedFilterItemsAsFlatArray, deserializeVolunteerFilters, serializeFilters } from "./helpers";
import { VolunteerListController } from "./VolunteerListController";
import { ViewMode } from "../common/types";
import { useCurrentUserQuery } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardListLoading } from "../common/DashboardListLoading";
import { ErrorMessage } from "@/components/core/common";
import { Button } from "@/components/core/button";
import { useScreenType } from "@/context/DeviceContext";
import { usePrefillFilters } from "../common/CardsFilter/usePrefillFilters";
import { ProjectPicker, useProjectParam } from "../common/ProjectPicker/ProjectPicker";

const SCOPE_PARAM = "scope";
const NO_OWNER_AGENT = "none";

enum VolunteerScope {
  MINE = "mine",
  NEED4DEED = "need4deed",
}

export function Volunteers() {
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUserQuery(true, false);
  const queryClient = useQueryClient();
  const isAgent = user?.role === UserRole.AGENT;
  const screenType = useScreenType();
  const { t } = useTranslation();
  const [numOfVols, setNumOfVols] = useState(0);
  const [sortOrder, setSortOrder] = useState(SortOrder.NewToOld);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { projectId: pickedProjectId } = useProjectParam();
  const isMapView = searchParams.get("view") === ViewMode.MAP;
  const projectId = isMapView ? undefined : pickedProjectId;
  const opportunityId = searchParams.get("opportunity") ?? undefined;
  const opportunityFilter = useGetOpportunity(opportunityId);
  const prefilledForRef = useRef<string | null>(null);

  const isExplicitEngagementClear = searchParams.getAll(QueryParamsKeys.ENGAGEMENT).includes("");

  const scope =
    searchParams.get(SCOPE_PARAM) === VolunteerScope.NEED4DEED ? VolunteerScope.NEED4DEED : VolunteerScope.MINE;
  const isMyVolunteers = isAgent && scope === VolunteerScope.MINE;
  const ownerAgents = !isAgent
    ? undefined
    : isMyVolunteers
      ? projectId
        ? [String(projectId)]
        : (user?.agentMemberships ?? []).map(({ agentId }) => String(agentId))
      : [NO_OWNER_AGENT];

  const isStaff = user?.role === UserRole.COORDINATOR || user?.role === UserRole.ADMIN;
  const roleDefaultEngagements = isMyVolunteers
    ? EMPTY_LIST
    : isAgent
      ? DEFAULT_NGO_VOLUNTEER_ENGAGEMENTS
      : isStaff
        ? DEFAULT_STAFF_VOLUNTEER_ENGAGEMENTS
        : EMPTY_LIST;

  const { cardsFilter, defaultAppliedRef, defaultEngagements, serializeWithDefaultMarker } = usePrefillFilters({
    searchParams,
    apiFilterOptions,
    defaultCardsFilter: defaultVolunteerCardsFilter,
    filterConfigs: volunteerFilterConfigs,
    deserializeFilters: deserializeVolunteerFilters,
    serializeFilters,
    defaultEngagements: DEFAULT_VOLUNTEER_ENGAGEMENTS,
    roleDefaultEngagements,
    skipDefaults: Boolean(opportunityId || isExplicitEngagementClear),
    isReady: Boolean(user),
  });

  const tabs = !user
    ? []
    : [
        t("dashboard.volunteers.tabs.tab1"),
        t("dashboard.volunteers.tabs.tab2"),
        t("dashboard.opportunities.tabs.tab3"),
      ];
  const urlViewParam = searchParams.get("view");
  const VIEW_MODE_BY_TAB = [ViewMode.LIST, ViewMode.CARDS, ViewMode.MAP];
  const isMobileUser = screenType === ScreenTypes.MOBILE && Boolean(user);
  const defaultTabIndex = isMobileUser ? 1 : 0;
  const foundIndex = VIEW_MODE_BY_TAB.findIndex((mode) => mode === urlViewParam);
  const selectedTabIndex = foundIndex === -1 ? defaultTabIndex : foundIndex;
  const viewMode = VIEW_MODE_BY_TAB[selectedTabIndex];

  const pushFilterUrl = (params: URLSearchParams | string) => {
    const query = params.toString();
    router.push(query ? pathname + questionMark + query : pathname, { scroll: false });
  };

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, [QueryParamsKeys.SEARCH]: searchInput }));
  };

  const handleSortChange = (sortOrder: string) => {
    setSortOrder(sortOrder as SortOrder);
  };

  const handleTabChange = (index: number) => {
    const targetViewMode = VIEW_MODE_BY_TAB[index] ?? ViewMode.LIST;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("view", targetViewMode);

    router.push(pathname + questionMark + params.toString(), { scroll: false });
  };

  const handleFilterUpdate = (
    newFilter: VolunteerCardsFilter | ((prev: VolunteerCardsFilter) => VolunteerCardsFilter),
  ) => {
    defaultAppliedRef.current = true;
    const updatedFilter = typeof newFilter === "function" ? newFilter(cardsFilter) : newFilter;

    pushFilterUrl(serializeWithDefaultMarker(updatedFilter));
  };

  const handleRemoveOpportunityFilter = () => {
    const wasPrefilled = searchParams.has(PREFILLED_PARAM);
    const cleared = wasPrefilled ? getClearFilter(cardsFilter) : clearCommutePrefill(cardsFilter);
    if (wasPrefilled) {
      roleDefaultEngagements.forEach((engagement) => {
        cleared[QueryParamsKeys.ENGAGEMENT][engagement] = true;
      });
    }
    const params = new URLSearchParams(serializeFilters(cleared, searchParams));
    params.delete("opportunity");
    params.delete(PREFILLED_PARAM);
    pushFilterUrl(params);
  };

  const handleClearFilter = (filterKey: string, parentKey?: string) => {
    defaultAppliedRef.current = true;
    const cleared =
      filterKey === QueryParamsKeys.COMMUTE_OPPORTUNITY_ID
        ? clearCommutePrefill(cardsFilter)
        : getClearSingleFilter(cardsFilter, filterKey, parentKey);
    pushFilterUrl(serializeWithDefaultMarker(cleared));
  };

  const handleClearAllFilters = () => {
    defaultAppliedRef.current = true;
    const cleared = {
      ...getClearFilter(cardsFilter),
      search: cardsFilter.search,
      hasCommuteSource: cardsFilter.hasCommuteSource,
    };
    pushFilterUrl(serializeWithDefaultMarker(cleared));
  };

  useEffect(() => {
    if (!user || !opportunityId || !opportunityFilter || !apiFilterOptions) return;
    if (prefilledForRef.current === opportunityId) return;
    prefilledForRef.current = opportunityId;
    if (hasFilterParams(searchParams, Object.keys(volunteerFilterConfigs))) return;

    const isAccompanying = opportunityFilter.volunteerType === ProfileVolunteeringType.ACCOMPANYING;
    const needsRefugeeLanguage =
      isAccompanying || opportunityFilter.volunteerType === ProfileVolunteeringType.REGULAR_ACCOMPANYING;
    const languages = opportunityFilter.languages.filter(({ purpose = LangPurpose.GENERAL }) =>
      needsRefugeeLanguage
        ? purpose === LangPurpose.RECIPIENT || purpose === LangPurpose.TRANSLATION
        : purpose === LangPurpose.GENERAL,
    );
    const prefilled = applyMatchingPrefill(
      withOptionFilters(volunteerFilterConfigs, defaultVolunteerCardsFilter, apiFilterOptions),
      {
        districtIds: opportunityFilter.districtIds,
        languages,
        availability: isAccompanying ? [] : opportunityFilter.availability,
        appointmentDate: isAccompanying ? opportunityFilter.appointmentDate : null,
        appointmentTime: isAccompanying ? opportunityFilter.appointmentTime : null,
        hasCommuteSource: user.role === UserRole.COORDINATOR || user.role === UserRole.ADMIN,
        maxCommuteMinutes: DEFAULT_MAX_COMMUTE_MINUTES,
      },
      { district: apiFilterOptions.district, language: apiFilterOptions.language },
    );
    prefilled[QueryParamsKeys.ENGAGEMENT][VolunteerStateEngagementType.AVAILABLE] = true;
    router.replace(pathname + questionMark + withPrefilledMarker(serializeFilters(prefilled, searchParams)));
  }, [apiFilterOptions, opportunityFilter, opportunityId, pathname, router, searchParams, user]);

  const handleScopeChange = (nextScope: string) => {
    if (nextScope === scope) return;
    const params = new URLSearchParams();
    const view = searchParams.get("view");
    if (view) params.set("view", view);
    if (nextScope === VolunteerScope.NEED4DEED) params.set(SCOPE_PARAM, nextScope);
    defaultAppliedRef.current = false;
    pushFilterUrl(params);
  };

  useEffect(() => {
    if (!isAgent || isMyVolunteers || !searchParams.has(QueryParamsKeys.SEARCH)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete(QueryParamsKeys.SEARCH);
    router.replace(pathname + questionMark + params.toString());
  }, [isAgent, isMyVolunteers, pathname, router, searchParams]);

  const activeFilters = createSelectedFilterItemsAsFlatArray(cardsFilter, handleFilterUpdate, t);

  if (isUserLoading) {
    return (
      <DashboardLayout>
        <DashboardListLoading />
      </DashboardLayout>
    );
  }

  if (isUserError || !user) {
    return (
      <DashboardLayout>
        <VolunteersContainer role="alert">
          <ErrorMessage message={t("message.errorGeneric")} />
          <Button
            text={t("dashboard.volunteers.retry")}
            onClick={() => queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })}
          />
        </VolunteersContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <VolunteersContainer>
        <CardsHeader
          header={t("dashboard.volunteers.volunteers")}
          headlineOptions={
            isAgent
              ? [
                  { key: VolunteerScope.MINE, label: t("dashboard.volunteers.myVolunteers") },
                  { key: VolunteerScope.NEED4DEED, label: t("dashboard.volunteers.need4deedVolunteers") },
                ]
              : undefined
          }
          selectedHeadline={scope}
          onHeadlineChange={handleScopeChange}
          subheader={isAgent && !isMyVolunteers ? t("dashboard.volunteers.askNeed4deedToContact") : undefined}
          resultCounter={numOfVols}
          resultText={t("dashboard.home.sidebar.volunteers")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={handleTabChange}
          showSort={viewMode !== ViewMode.MAP}
          filtersContent={
            <FiltersContent
              setFilter={handleFilterUpdate}
              filter={cardsFilter}
              viewMode={viewMode}
              isMatchMode={!!opportunityId}
            />
          }
          onSearchInputChange={handleSearchInputChange}
          searchValue={cardsFilter.search}
          showSearch={!isAgent || isMyVolunteers}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
          activeFilters={activeFilters}
          onClearAllFilters={handleClearAllFilters}
          onClearFilter={handleClearFilter}
          entityFilter={
            opportunityFilter ? { ...opportunityFilter, onRemove: handleRemoveOpportunityFilter } : undefined
          }
        />
        {isMyVolunteers && !isMapView && <ProjectPicker />}
        <ContentRow>
          <VolunteerListController
            setNumOfVols={setNumOfVols}
            sortOrder={sortOrder}
            filter={cardsFilter}
            setFilter={handleFilterUpdate}
            apiFilterOptions={apiFilterOptions}
            opportunityId={opportunityId}
            viewMode={viewMode}
            opportunityFilter={opportunityFilter}
            defaultEngagements={defaultEngagements}
            ownerAgents={ownerAgents}
          />
        </ContentRow>
      </VolunteersContainer>
    </DashboardLayout>
  );
}

export default Volunteers;

const VolunteersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-container-gap);
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--dashboard-volunteers-container-gap);

  @media (max-width: 1023px) {
    flex-wrap: wrap;
  }
`;
