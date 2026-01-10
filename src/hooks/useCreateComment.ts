import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { EntityTableName } from "need4deed-sdk";

type CreateCommentData = {
  text: string;
  entityType: EntityTableName;
  entityId: number;
};

export const useCreateComment = (volunteerId: number) => {
  return useMutationQuery<CreateCommentData, { message: string }>({
    apiPath: apiPathComment,
    method: "post",
    successMessage: "dashboard.commentsSection.commentAdded",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });
};
