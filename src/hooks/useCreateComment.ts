import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { EntityTableName } from "need4deed-sdk";

type CreateCommentData = {
  text: string;
  entityType: EntityTableName;
  entityId: number;
};

type CreateCommentResponse = {
  message: string;
  data: {
    id: number;
    text: string;
    entityType: EntityTableName;
    entityId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

export const useCreateComment = (volunteerId: number) => {
  return useMutationQuery<CreateCommentData, CreateCommentResponse>({
    apiPath: apiPathComment,
    method: "post",
    successMessage: "dashboard.volunteerProfile.commentsSection.commentAdded",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });
};
