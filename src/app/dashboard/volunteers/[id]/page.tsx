import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { RouteParams } from "@/types";

export default function DashboardVolunteerPage({ params }: RouteParams) {
  const { id } = params;
  return <ProfileLayout volunteerId={id} />;
}
