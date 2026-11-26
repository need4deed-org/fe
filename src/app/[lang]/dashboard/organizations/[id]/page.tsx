import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { RouteParams } from "@/types";
import React from "react";

export default async function DashboardOrganizationPage({ params }: RouteParams) {
  const { id } = await params;
  return <ProfileLayout entityId={id} entityType="organization" />;
}
