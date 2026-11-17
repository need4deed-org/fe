import { routes } from "@/constants/routes";
import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { getServerUser } from "@/hooks/api/getUser";
import { isOwnProfile } from "@/utils/is-own-profile";
import { UserRole } from "need4deed-sdk";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardAgentPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const user = await getServerUser(cookieHeader);

  if (user?.role === UserRole.AGENT && !isOwnProfile(user, { agentId: id })) {
    redirect(routes.organizations(lang));
  }
  return <ProfileLayout entityId={id} entityType="agent" />;
}
