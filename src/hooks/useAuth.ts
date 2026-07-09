import { Id, UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";

export const useAuth = (contactPersonId?: Id) => {
  const user = useCurrentUser();
  const personId = (user as typeof user & { personId?: number })?.personId;

  const isAuthorized = user?.role === UserRole.ADMIN || user?.role === UserRole.COORDINATOR;
  const isOwnProfile =
    (user?.role === UserRole.VOLUNTEER || user?.role === UserRole.AGENT) && personId === contactPersonId;

  return { isAuthorized, isOwnProfile };
};
