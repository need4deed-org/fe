import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import ProfilePage from "./ProfilePage";
import { apiProfilePath } from "@/config/constants";
import { VolunteerIdProps } from "@/types";

export function ProfileController({ volunteerId }: VolunteerIdProps) {
  const { data: volunteerData, isLoading } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteersProfile", volunteerId],
    apiPath: apiProfilePath(volunteerId),
  });

  if (isLoading || !volunteerData) {
    return <div>Loading...</div>;
  }

  return <ProfilePage volunteers={volunteerData} />;
}
