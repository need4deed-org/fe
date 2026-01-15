import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";

export const useDeleteComment = (volunteerId: number, commentId: number) => {
  return useMutationQuery<unknown, { message: string }>({
    apiPath: `${apiPathComment}/${commentId}`,
    method: "delete",
    successMessage: "dashboard.commentsSection.commentDeleted",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });
};
