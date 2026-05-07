import { useCallback, useEffect } from "react";

import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOptionLists, ApiVolunteerGetList, SortOrder } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CardsFilter } from "./Filters/types";
import { serializeFilters } from "./helpers";
import { VolunteerCardList } from "./VolunteerCardList"; // We will modify this component

const columns = 3;
const rows = 3;
const limit = columns * rows;

interface VolunteerListControllerProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: CardsFilter;
  apiFilterOptions?: ApiOptionLists;
  opportunityId?: string;
}

export function VolunteerListController({
  setNumOfVols,
  sortOrder,
  isFiltersOpen,
  filter,
  apiFilterOptions,
  opportunityId,
}: VolunteerListControllerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const setCurrentPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(page));
      router.replace(pathname + "?" + params.toString());
    },
    [router, pathname, searchParams],
  );

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
      opportunityId={opportunityId}
    />
  );
}
