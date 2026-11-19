"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/Layout";
import {
  apiPathOption,
  DashboardRoutes,
  DEFAULT_MAX_COMMUTE_MINUTES,
  questionMark,
  ScreenTypes,
} from "@/config/constants";
import { PlusIcon } from "@phosphor-icons/react";
import { useGetVolunteer, useGetQuery } from "@/hooks";
import { ApiOptionLists, LangProficiency, QueryParamsKeys, UserRole } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { getClearFilter, getClearSingleFilter } from "../common/CardsFilter/helpers";
import {
  applyMatchingPrefill,
  clearCommutePrefill,
  hasFilterParams,
  PREFILLED_PARAM,
  withPrefilledMarker,
} from "../common/CardsFilter/matchingPrefill";
import { withOptionFilters } from "../common/CardsFilter/selectionFilters";
import { opportunityFilterConfigs } from "./Filters/config";
import { defaultOpportunityCardsFilter, MATCHING_OPPORTUNITY_STATUSES, STATUS_PARAM } from "./Filters/constants";
import FiltersContent from "./Filters/FiltersContent";
import { OpportunityCardsFilter } from "./Filters/types";
import { createSelectedOpportunityFiltersAsFlatArray } from "./Filters/helpers";
import {
  deserializeOpportunityFilters,
  serializeOpportunityFilters,
  parseSortParam,
  SORT_PARAM,
  DEFAULT_SORT_ORDER,
} from "./helpers";
import { OpportunityListController } from "./OpportunityListController";
import { OtherOpportunities } from "./OtherOpportunities";
import { CircleIconLink } from "@/components/styled/circle-icon-button";
import { ContentRow, OpportunitiesContainer } from "./styles";
import { ViewMode } from "../common/types";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useScreenType } from "@/context/DeviceContext";

export function Opportunities() {
  const user = useCurrentUser(true);
  const screenType = useScreenType();
  const { t, i18n } = useTranslation();
  const [numOfOpps, setNumOfOpps] = useState(0);
  const [cardsFilter, setCardsFilter] = useState(defaultOpportunityCardsFilter);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthorized: isStaff } = useAuth();
  const sortOrder = parseSortParam(searchParams.get(SORT_PARAM));
  const isAgent = user?.role === UserRole.AGENT;
  const tabs = !user
    ? []
    : [
        t("dashboard.opportunities.tabs.tab1"),
        t("dashboard.opportunities.tabs.tab2"),
        t("dashboard.opportunities.tabs.tab3"),
        ...(isAgent ? [t("dashboard.opportunities.other.title")] : []),
      ];

  const urlViewParam = searchParams.get("view");
  const VIEW_MODE_BY_TAB = [ViewMode.LIST, ViewMode.CARDS, ViewMode.MAP];
  const isOtherTab = isAgent && urlViewParam === OTHER_OPPORTUNITIES_VIEW;
  const foundIndex = VIEW_MODE_BY_TAB.findIndex((mode) => mode === urlViewParam);
  const defaultTabIndex = screenType === ScreenTypes.MOBILE ? 1 : 0;
  const selectedTabIndex = isOtherTab ? VIEW_MODE_BY_TAB.length : foundIndex === -1 ? defaultTabIndex : foundIndex;
  const viewMode = VIEW_MODE_BY_TAB[isOtherTab ? defaultTabIndex : selectedTabIndex];

  const volunteerId = searchParams.get("volunteer") ?? undefined;
  const volunteerFilter = useGetVolunteer(volunteerId);
  const prefilledForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!volunteerId || !volunteerFilter || !apiFilterOptions) return;
    if (prefilledForRef.current === volunteerId) return;
    prefilledForRef.current = volunteerId;
    if (hasFilterParams(searchParams, Object.keys(opportunityFilterConfigs))) return;

    const prefilled = applyMatchingPrefill(
      withOptionFilters(opportunityFilterConfigs, defaultOpportunityCardsFilter, apiFilterOptions),
      {
        districtIds: volunteerFilter.districtIds,
        languages: volunteerFilter.languages.filter(({ proficiency }) => proficiency !== LangProficiency.BEGINNER),
        availability: volunteerFilter.availability,
        hasCommuteSource: true,
        maxCommuteMinutes: DEFAULT_MAX_COMMUTE_MINUTES,
      },
      { district: apiFilterOptions.district, language: apiFilterOptions.language },
    );
    MATCHING_OPPORTUNITY_STATUSES.forEach((status) => {
      prefilled.status[status] = true;
    });
    router.replace(pathname + questionMark + withPrefilledMarker(serializeOpportunityFilters(prefilled, searchParams)));
  }, [apiFilterOptions, volunteerFilter, volunteerId, pathname, router, searchParams]);

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, search: searchInput }));
  };

  const handleSortChange = (order: string) => {
    const sort = parseSortParam(order);
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (sort === DEFAULT_SORT_ORDER) params.delete(SORT_PARAM);
    else params.set(SORT_PARAM, sort);
    router.push(pathname + questionMark + params.toString());
  };

  const handleTabChange = (index: number) => {
    const targetViewMode =
      index === VIEW_MODE_BY_TAB.length ? OTHER_OPPORTUNITIES_VIEW : (VIEW_MODE_BY_TAB[index] ?? ViewMode.LIST);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("view", targetViewMode);

    router.push(pathname + questionMark + params.toString());
  };

  const extraSortOptions = [
    { value: "appointment-proximal", label: t("dashboard.sortBy.appointmentProximal") },
    { value: "appointment-distant", label: t("dashboard.sortBy.appointmentDistant") },
  ];

  const handleFilterUpdate = (
    newFilter: OpportunityCardsFilter | ((prev: OpportunityCardsFilter) => OpportunityCardsFilter),
  ) => {
    const updatedFilter = typeof newFilter === "function" ? newFilter(cardsFilter) : newFilter;
    setCardsFilter(updatedFilter);
    router.push(pathname + questionMark + serializeOpportunityFilters(updatedFilter, searchParams), {
      scroll: false,
    });
  };

  const handleRemoveVolunteerFilter = () => {
    const wasPrefilled = searchParams.has(PREFILLED_PARAM);
    const cleared = wasPrefilled ? getClearFilter(cardsFilter) : clearCommutePrefill(cardsFilter);
    setCardsFilter(cleared);
    const params = new URLSearchParams(serializeOpportunityFilters(cleared, searchParams));
    params.delete("volunteer");
    params.delete(PREFILLED_PARAM);
    router.push(pathname + questionMark + params.toString(), { scroll: false });
  };

  const handleClearFilter = (filterKey: string, parentKey?: string) => {
    const cleared =
      filterKey === QueryParamsKeys.COMMUTE_VOLUNTEER_ID
        ? clearCommutePrefill(cardsFilter)
        : getClearSingleFilter(cardsFilter, filterKey, parentKey);
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeOpportunityFilters(cleared, searchParams), { scroll: false });
  };

  const handleClearAllFilters = () => {
    const cleared = {
      ...getClearFilter(cardsFilter),
      search: cardsFilter.search,
      hasCommuteSource: cardsFilter.hasCommuteSource,
    };
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeOpportunityFilters(cleared, searchParams), { scroll: false });
  };

  useEffect(() => {
    if (!apiFilterOptions) return;

    setCardsFilter((prev) => {
      const baseFilters = withOptionFilters(opportunityFilterConfigs, prev, apiFilterOptions);

      return deserializeOpportunityFilters(baseFilters, searchParams);
    });
  }, [apiFilterOptions, searchParams]);

  const isVolunteer = user?.role === UserRole.VOLUNTEER;
  const activeFilters = createSelectedOpportunityFiltersAsFlatArray(cardsFilter, setCardsFilter, t).filter(
    ({ parentKey }) => !isVolunteer || parentKey !== STATUS_PARAM,
  );

  return (
    <DashboardLayout>
      <OpportunitiesContainer data-testid="opportunities-container">
        <CardsHeader
          header={t("dashboard.opportunities.opportunities")}
          resultCounter={numOfOpps}
          resultText={t("dashboard.home.sidebar.opportunities")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={handleTabChange}
          showSort={viewMode !== ViewMode.MAP}
          filtersContent={
            <FiltersContent setFilter={handleFilterUpdate} filter={cardsFilter} isMatchMode={!!volunteerId} />
          }
          onSearchInputChange={handleSearchInputChange}
          searchValue={cardsFilter.search}
          searchPlaceholder={t("dashboard.opportunities.card.search")}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
          extraSortOptions={extraSortOptions}
          activeFilters={isOtherTab ? [] : activeFilters}
          onClearAllFilters={handleClearAllFilters}
          onClearFilter={handleClearFilter}
          entityFilter={
            volunteerFilter && !isOtherTab ? { ...volunteerFilter, onRemove: handleRemoveVolunteerFilter } : undefined
          }
          showListControls={!isOtherTab}
          headerAction={
            isStaff && (
              <CircleIconLink
                href={`/${i18n.language}${DashboardRoutes.Opportunities}/new`}
                aria-label={t("dashboard.home.createOpportunity")}
              >
                <PlusIcon size={16} weight="bold" />
              </CircleIconLink>
            )
          }
        />
        {isOtherTab ? (
          <OtherOpportunities search={cardsFilter.search} setCount={setNumOfOpps} />
        ) : (
          <ContentRow>
            <OpportunityListController
              setNumOfOpps={setNumOfOpps}
              sortOrder={sortOrder}
              filter={cardsFilter}
              setFilter={handleFilterUpdate}
              apiFilterOptions={apiFilterOptions}
              volunteerId={volunteerId}
              viewMode={viewMode}
              volunteerFilter={volunteerFilter}
            />
          </ContentRow>
        )}
      </OpportunitiesContainer>
    </DashboardLayout>
  );
}

const OTHER_OPPORTUNITIES_VIEW = "other";
