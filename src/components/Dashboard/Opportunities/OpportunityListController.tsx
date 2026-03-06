import { useEffect, useState } from "react";
import { apiPathOpportunity, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiVolunteerOpportunityGetList, ApiOptionLists, SortOrder } from "need4deed-sdk";
import { OpportunityCardsFilter } from "./Filters/types";
import { serializeOpportunityFilters } from "./helpers";
import { OpportunityCardList } from "./OpportunityCardList";

const columns = 3;
const rows = 3;
const limit = columns * rows;

type Props = {
  setNumOfOpps: (num: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: OpportunityCardsFilter;
  apiFilterOptions?: ApiOptionLists;
  volunteerId?: string;
};

export function OpportunityListController({
  setNumOfOpps,
  sortOrder,
  isFiltersOpen,
  filter,
  apiFilterOptions,
  volunteerId,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const serializedFilter = serializeOpportunityFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
  }) as URLSearchParams;

  if (volunteerId) {
    serializedFilter.set("volunteer", volunteerId);
  }

  const { data, count } = useGetQuery<ApiVolunteerOpportunityGetList[]>({
    queryKey: ["opportunities"],
    apiPath: `${apiPathOpportunity}/`,
    params: {
      limit,
      page: currentPage,
      sortOrder,
      filter: serializedFilter,
    },
    staleTime: cacheTTL,
  });

  const opportunities: ApiVolunteerOpportunityGetList[] = data || [];

  useEffect(() => {
    setNumOfOpps(count);
  }, [count, setNumOfOpps]);

  return (
    <OpportunityCardList
      opportunities={opportunities}
      count={count}
      columns={columns - (isFiltersOpen ? 1 : 0)}
      rows={rows + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      volunteerId={volunteerId}
    />
  );
}
