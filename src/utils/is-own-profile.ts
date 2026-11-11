import { ApiUserGet, Id, UserRole } from "need4deed-sdk";

export type ProfileOwner = { agentId?: Id; personId?: Id };

type Viewer = Pick<ApiUserGet, "role" | "agentId" | "personId">;

const isSameId = (own: number | null | undefined, other: Id | undefined) =>
  own != null && other != null && own === Number(other);

export function isOwnProfile(viewer: Viewer | undefined, owner: ProfileOwner | undefined): boolean {
  if (!viewer || !owner) return false;
  if (viewer.role === UserRole.VOLUNTEER) return isSameId(viewer.personId, owner.personId);
  if (viewer.role === UserRole.AGENT) return isSameId(viewer.agentId, owner.agentId);
  return false;
}
