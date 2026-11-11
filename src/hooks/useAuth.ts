import { Id, UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";

export const useAuth = (owner?: { agentId?: Id; personId?: Id }) => {
  const user = useCurrentUser();
  const personId = user?.personId;
  const agentId = user?.agentId;
  const isAgent = user?.role === UserRole.AGENT;
  const isVolunteer = user?.role === UserRole.VOLUNTEER;

  const isAdmin = user?.role === UserRole.ADMIN;
  const isAuthorized = isAdmin || user?.role === UserRole.COORDINATOR;
  const isOwnProfile =
    (isVolunteer && personId !== undefined && personId === owner?.personId) ||
    (isAgent && agentId !== undefined && agentId === owner?.agentId);

  return { isAdmin, isAuthorized, isOwnProfile, isAgent, isVolunteer, isUserLoaded: Boolean(user) };
};
