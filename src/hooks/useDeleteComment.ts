import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { Id } from "need4deed-sdk";

type EntityType = "volunteer" | "opportunity" | "agent";

export const useDeleteComment = (entityId: Id, commentId: number, entityType: EntityType = "volunteer") => {
  return useMutationQuery<unknown, { message: string }>({
    apiPath: `${apiPathComment}/${commentId}`,
    method: "delete",
    successMessage: "dashboard.commentsSection.commentDeleted",
    queryKeyToInvalidate: [entityType, String(entityId)],
  });
};
