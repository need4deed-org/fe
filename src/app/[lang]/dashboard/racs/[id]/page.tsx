"use client";

import RacProfile from "@/components/Dashboard/Profile/sections/RefugeeAccommodationCentre/RacsProfile";
import { useEffect, useState } from "react";
import { ApiPersonGet } from "need4deed-sdk";
import { useGetQuery } from "@/hooks/useGetQuery";
import { apiPathPerson } from "@/config/constants";
import { useParams } from "next/navigation";

export default function RacsPage() {
  const [person, setPerson] = useState<ApiPersonGet>();
  const params = useParams();
  const { data: persons } = useGetQuery<ApiPersonGet[]>({
    queryKey: ["person", String(params.id)],
    apiPath: apiPathPerson,
  });

  useEffect(() => {
    if (persons?.length) {
      const singlePersonIndex = persons?.findIndex((person) => person.id === Number(params.id));
      setPerson(persons[singlePersonIndex]);
    }
  }, [persons, params.id]);
  return <RacProfile person={person} />;
}
