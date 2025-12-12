import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiVolunteerGet } from "need4deed-sdk";
import ProfilePage from "./ProfilePage";

export function ProfileController({ volunteerId }: { volunteerId: string }) {
  const { data } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteers", volunteerId],
    apiPath: `${apiPathVolunteer}${volunteerId}`,
    staleTime: cacheTTL,
  });

  if (!data) return null;

  return <ProfilePage volunteer={data} />;
}
