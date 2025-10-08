import React, { useEffect, useState } from "react";

import { ApiVolunteerGetList, SortOrder } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import { apiPathVolunteer } from "@/config/constants";
import { VolunteerCardList } from "./VolunteerCardList"; // We will modify this component
import { CardsFilter } from "./Filters/types";
import { serializeFilters } from "./helpers";

const columns = 4;
const rows = 3;
const limit = columns * rows;
const cacheTTL = 1000 * 60 * 5; // 5 minutes

interface VolunteerListControllerProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: CardsFilter;
}

export function VolunteerListController({
  setNumOfVols,
  sortOrder,
  isFiltersOpen,
  filter,
}: VolunteerListControllerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const serializedFilter = serializeFilters(filter, undefined, false) as URLSearchParams;
  const { data, count } = useGetQuery<ApiVolunteerGetList[]>({
    queryKey: ["volunteers"],
    apiPath: apiPathVolunteer,
    params: {
      limit: limit,
      page: currentPage,
      sortOrder,
      filter: serializedFilter,
    },
    staleTime: cacheTTL,
  });
  const volunteers = data || [];

  useEffect(() => {
    setNumOfVols(count);
  }, [count, setNumOfVols]);

  return (
    <VolunteerCardList
      volunteers={volunteers}
      count={count}
      columns={columns - (isFiltersOpen ? 1 : 0)}
      rows={rows + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
}
