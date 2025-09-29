import React, { useEffect, useState } from "react";

import { ApiVolunteerGetList, SortOrder } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import { apiPathVolunteer } from "@/config/constants";
import { VolunteerCardList } from "./VolunteerCardList"; // We will modify this component

const columns = 4;
const rows = 3;
const limit = columns * rows;
const cacheTTL = 1000 * 60 * 5; // 5 minutes

interface VolunteerListControllerProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
}

export function VolunteerListController({ setNumOfVols, sortOrder }: VolunteerListControllerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: volunteers, count } = useGetQuery<ApiVolunteerGetList>({
    queryKey: ["volunteers"],
    apiPath: apiPathVolunteer,
    options: {
      limit: limit,
      page: currentPage,
      staleTime: cacheTTL,
      sortOrder,
    },
  });

  useEffect(() => {
    setNumOfVols(count);
  }, [count, setNumOfVols]);

  return (
    <VolunteerCardList
      volunteers={volunteers}
      count={count}
      columns={columns}
      rows={rows}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
}
