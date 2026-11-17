import { UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";
import { isOwnProfile as isOwnProfileOf, ProfileOwner } from "@/utils/is-own-profile";

export const useAuth = (owner?: ProfileOwner) => {
  const user = useCurrentUser();
  const isAgent = user?.role === UserRole.AGENT;
  const isVolunteer = user?.role === UserRole.VOLUNTEER;

  const isAdmin = user?.role === UserRole.ADMIN;
  const isAuthorized = isAdmin || user?.role === UserRole.COORDINATOR;
  const isOwnProfile = isOwnProfileOf(user, owner);

  return { isAdmin, isAuthorized, isOwnProfile, isAgent, isVolunteer, isUserLoaded: Boolean(user) };
};
