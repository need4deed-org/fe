import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";

type UpdateCommentData = {
  text: string;
};

export const useUpdateComment = (volunteerId: number, commentId: number) => {
  return useMutationQuery<UpdateCommentData, { message: string }>({
    apiPath: `${apiPathComment}/${commentId}`,
    method: "patch",
    successMessage: "dashboard.volunteerProfile.commentsSection.commentUpdated",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });
};
