import React from "react";

import { PaginatedGrid } from "@/components/core/paginatedGrid";
import VolunteerCard from "./VolunteerCard";
import { mockVolunteer } from "./tempMockVolunteer";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";

const API_PATH_VOLUNTEER = "/api/volunteer";

export function VolunteerCardList() {
  const {
    data: volunteers,
    isLoading,
    isError,
    error,
  } = useGetQuery<ApiVolunteerGetList>(
    ["volunteersList"], // Unique query key for this data
    API_PATH_VOLUNTEER,
  );

  console.log("****");
  console.log("volunteers", volunteers);
  console.log("isLoading", isLoading);
  console.log("isError", isError);
  console.log("error", error);

  const items = [
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,

    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    <VolunteerCard key={mockVolunteer.name} volunteer={mockVolunteer} />,
    ,
  ];

  return <PaginatedGrid items={items} columns={4} rows={3} />;
}

export default VolunteerCardList;
