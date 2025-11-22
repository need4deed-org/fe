import { ApiVolunteerGetList } from "need4deed-sdk";
import React from "react";

import { PaginatedGrid } from "@/components/core/paginatedGrid";

import VolunteerCard from "./VolunteerCard";

interface VolunteerCardListProps {
  volunteers: ApiVolunteerGetList[];
  count: number;
  columns: number;
  rows: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function VolunteerCardList({
  volunteers,
  count,
  columns,
  rows,
  currentPage,
  setCurrentPage,
}: VolunteerCardListProps) {
  const items = volunteers.map((volunteer) => (
    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
  ));

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
