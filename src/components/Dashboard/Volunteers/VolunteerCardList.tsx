import React, { useEffect, useState } from "react";

import { PaginatedGrid } from "@/components/core/paginatedGrid";
import VolunteerCard from "./VolunteerCard";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import { apiPathVolunteer, SortOrder } from "@/config/constants";

const columns = 4;
const rows = 3;
const limit = columns * rows;
const cacheTTL = 1000 * 60 * 5; // 5 minutes

interface VolunteerCardListProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
}

export function VolunteerCardList({ setNumOfVols, sortOrder }: VolunteerCardListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: volunteers, count } = useGetQuery<ApiVolunteerGetList>({
    queryKey: ["volunteersList"],
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

  const items = volunteers.map((volunteer) => <VolunteerCard key={volunteer.id} volunteer={volunteer} />);

  return (
    <PaginatedGrid
      pageItems={items}
      columns={columns}
      rows={rows}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalItemCounts={count}
    />
  );
}

export default VolunteerCardList;
