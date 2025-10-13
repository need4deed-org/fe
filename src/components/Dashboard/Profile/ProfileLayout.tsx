"use client";
import { DashboardLayout } from "@/components/Layout";
import { VolunteerController } from "./ProfileController";

const ProfileLayout = () => {
  return (
    <DashboardLayout>
      <VolunteerController />
    </DashboardLayout>
  );
};

export default ProfileLayout;
