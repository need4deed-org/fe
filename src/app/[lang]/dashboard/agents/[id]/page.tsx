import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { getServerUser } from "@/hooks/api/getUser";
import { RouteParams } from "@/types";
import { isOwnProfile } from "@/utils/is-own-profile";
import { UserRole } from "need4deed-sdk";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardAgentPage({ params }: RouteParams) {
  const { id } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const user = await getServerUser(cookieHeader);

  if (user?.role === UserRole.AGENT && !isOwnProfile(user, { agentId: id })) {
    redirect(`/dashboard/agents`);
  }
  return <ProfileLayout entityId={id} entityType="agent" />;
}
