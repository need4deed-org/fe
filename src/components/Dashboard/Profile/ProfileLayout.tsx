"use client";
import { DashboardLayout } from "@/components/Layout";
import { VolunteerController } from "./ProfileController";
import { VolunteerIdProps } from "@/types";

export default function ProfileLayout({ volunteerId }: VolunteerIdProps) {
  return (
    <DashboardLayout>
      <VolunteerController volunteerId={volunteerId} />
    </DashboardLayout>
  );
}
