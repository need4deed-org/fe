import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import Profile from "./ProfilePage";
import { apiProfilePath } from "@/config/constants";

export function VolunteerController() {
  const { data: volunteerData, isLoading } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteersProfile"],
    apiPath: apiProfilePath,
  });

  if (isLoading || !volunteerData) {
    return <div>Loading...</div>;
  }

  return <Profile volunteers={volunteerData} />;
}
