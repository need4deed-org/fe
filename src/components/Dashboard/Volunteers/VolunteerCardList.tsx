import React from "react";

import { PaginatedGrid } from "@/components/core/paginatedGrid";
import VolunteerCard from "./VolunteerCard";
import { mockVolunteer } from "./tempMockVolunteer";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";

const API_PATH_VOLUNTEER = "/api/volunteer";

export function VolunteerCardList() {
  const { data, isLoading, isError, error } = useGetQuery<ApiVolunteerGetList>(["volunteersList"], API_PATH_VOLUNTEER, {
    limit: 12,
    page: 2,
  });

  const volunteers = data;

  console.log("volunteers", volunteers);
  console.log("isLoading", isLoading);
  console.log("isError", isError);
  console.log("error", error);

  const items = volunteers.map((volunteer) => <VolunteerCard key={volunteer.name} volunteer={volunteer} />);
  //   const items = [<VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />, ,];

  return <PaginatedGrid items={items} columns={4} rows={3} />;
}

export default VolunteerCardList;
