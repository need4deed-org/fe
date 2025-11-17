"use client";
import { DashboardLayout } from "@/components/Layout";
import { ProfileController } from "./ProfileController";
import { VolunteerIdProps } from "@/types";

export default function ProfileLayout({ volunteerId }: VolunteerIdProps) {
  return (
    <DashboardLayout>
      <ProfileController volunteerId={volunteerId} />
    </DashboardLayout>
  );
}
