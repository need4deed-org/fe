import { ApiUserGet, Id, UserRole } from "need4deed-sdk";

export type ProfileOwner = { agentId?: Id; personId?: Id };

type Viewer = Pick<ApiUserGet, "role" | "agentMemberships" | "personId">;

const isSameId = (own: Id | null | undefined, other: Id | undefined) =>
  own != null && other != null && String(own) === String(other);

export function isOwnProfile(viewer: Viewer | undefined, owner: ProfileOwner | undefined): boolean {
  if (!viewer || !owner) return false;
  if (viewer.role === UserRole.VOLUNTEER) return isSameId(viewer.personId, owner.personId);
  if (viewer.role === UserRole.AGENT) {
    return (viewer.agentMemberships ?? []).some(({ agentId }) => isSameId(agentId, owner.agentId));
  }
  return false;
}
