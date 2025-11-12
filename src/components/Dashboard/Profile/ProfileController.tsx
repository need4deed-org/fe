import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import Profile from "./ProfilePage";
import { apiProfilePath } from "@/config/constants";
import { VolunteerIdProps } from "@/types";

export function VolunteerController({ volunteerId }: VolunteerIdProps) {
  const { data: volunteerData, isLoading } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteersProfile", volunteerId],
    apiPath: apiProfilePath(volunteerId),
  });

  if (isLoading || !volunteerData) {
    return <div>Loading...</div>;
  }

  return <Profile volunteers={volunteerData} />;
}
