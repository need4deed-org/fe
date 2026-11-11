import { ApiUserGet, Id, UserRole } from "need4deed-sdk";

export type ProfileOwner = { agentId?: Id; personId?: Id };

type Viewer = Pick<ApiUserGet, "role" | "agentId" | "agentMemberships" | "personId">;

const isSameId = (own: Id | null | undefined, other: Id | undefined) =>
  own != null && other != null && Number(own) === Number(other);

export function isOwnProfile(viewer: Viewer | undefined, owner: ProfileOwner | undefined): boolean {
  if (!viewer || !owner) return false;
  if (viewer.role === UserRole.VOLUNTEER) return isSameId(viewer.personId, owner.personId);
  if (viewer.role === UserRole.AGENT) {
    const agentIds = [viewer.agentId, ...(viewer.agentMemberships ?? []).map(({ agentId }) => agentId)];
    return agentIds.some((agentId) => isSameId(agentId, owner.agentId));
  }
  return false;
}
