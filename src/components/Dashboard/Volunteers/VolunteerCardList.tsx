import React, { useState } from "react";

import { PaginatedGrid } from "@/components/core/paginatedGrid";
import VolunteerCard from "./VolunteerCard";
import { mockVolunteer } from "./tempMockVolunteer";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";

const API_PATH_VOLUNTEER = "/api/volunteer";
const columns = 4;
const rows = 3;
const limit = columns * rows;
const cacheTTL = 1000 * 60 * 5; // 5 minutes

export function VolunteerCardList() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: volunteers, count } = useGetQuery<ApiVolunteerGetList>({
    queryKey: ["volunteersList"],
    apiPath: API_PATH_VOLUNTEER,
    options: {
      limit: limit,
      page: currentPage,
      staleTime: cacheTTL,
    },
  });

  const items = volunteers.map((volunteer) => <VolunteerCard key={volunteer.id} volunteer={volunteer} />);
  //   items.unshift(<VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />);

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
