"use client";
import { DashboardLayout } from "@/components/Layout";
import { VolunteerController } from "./ProfileController";
import { VolunteerIdProps } from "@/types";

export default function ProfileLayout({ volunteerId }: VolunteerIdProps) {
  const backgroundColor = "var(--layout-static-page-background-default)";
  return (
    <DashboardLayout background={backgroundColor}>
      <VolunteerController volunteerId={volunteerId} />
    </DashboardLayout>
  );
}
