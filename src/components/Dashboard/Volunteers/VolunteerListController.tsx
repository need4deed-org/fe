import { useEffect } from "react";

import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import { ApiOptionLists, ApiVolunteerGetList, SortOrder } from "need4deed-sdk";
import { CardsFilter } from "./Filters/types";
import { serializeFilters } from "./helpers";
import { VolunteerCardList } from "./VolunteerCardList"; // We will modify this component
import { VolunteerTableList } from "./VolunteerTableList";

const columns = 3;
const rows = 3;
const limit = columns * rows;
const LIST_TAB_INDEX = 0;

interface VolunteerListControllerProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: CardsFilter;
  apiFilterOptions?: ApiOptionLists;
  opportunityId?: string;
  selectedTabIndex: number;
}

export function VolunteerListController({
  setNumOfVols,
  sortOrder,
  isFiltersOpen,
  filter,
  apiFilterOptions,
  opportunityId,
  selectedTabIndex,
}: VolunteerListControllerProps) {
  const { currentPage, setCurrentPage } = usePageParam();
  const serializedFilter = serializeFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
  }) as URLSearchParams;

  if (opportunityId) {
    serializedFilter.set("opportunity", opportunityId);
  }
  const params = {
    limit: limit,
    page: currentPage,
    sortOrder,
    filter: serializedFilter,
  };
  const { data, count } = useGetQuery<ApiVolunteerGetList[]>({
    queryKey: ["volunteers"],
    apiPath: apiPathVolunteer,
    params,
    staleTime: cacheTTL,
  });
  const volunteers = data || [];

  const isListView = selectedTabIndex === LIST_TAB_INDEX;

  useEffect(() => {
    setNumOfVols(count);
  }, [count, setNumOfVols]);

  if (isListView) {
    return (
      <VolunteerTableList
        volunteers={volunteers}
        count={count}
        itemsPerPage={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        opportunityId={opportunityId}
      />
    );
  }

  return (
    <VolunteerCardList
      volunteers={volunteers}
      count={count}
      columns={columns - (isFiltersOpen ? 1 : 0)}
      rows={rows + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      opportunityId={opportunityId}
    />
  );
}
