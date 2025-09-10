import React from "react";

import { PaginatedGrid } from "@/components/core/paginatedGrid";
import VolunteerCard from "./VolunteerCard";
import { mockVolunteer } from "./tempMockVolunteer";

export function VolunteerCardList() {
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
