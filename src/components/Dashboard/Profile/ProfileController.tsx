import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import Profile from "./ProfilePage";

export function VolunteerController() {
  const { data: volunteerData, isLoading } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteersProfile"],
    apiPath: "http://localhost:5001/volunteer/1086",
  });

  if (isLoading || !volunteerData) {
    return <div>Loading...</div>;
  }

  return <Profile volunteers={volunteerData} />;
}
