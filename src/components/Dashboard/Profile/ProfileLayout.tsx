"use client";
import { DashboardLayout } from "@/components/Layout";
import { ProfileController } from "./ProfileController";
import { VolunteerIdProps } from "@/types";

export default function ProfileLayout({ volunteerId }: VolunteerIdProps) {
  const backgroundColor = "var(--layout-static-page-background-default)";
  return (
    <DashboardLayout background={backgroundColor}>
      <ProfileController volunteerId={volunteerId} />
    </DashboardLayout>
  );
}
