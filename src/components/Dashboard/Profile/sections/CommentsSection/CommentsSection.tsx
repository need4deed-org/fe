"use client";
import { Heading2 } from "@/components/styled/text";
import { useCreateComment } from "@/hooks/useCreateComment";
import { formatDateTime } from "@/utils";
import { ChatCircleDots, DotsThreeOutline } from "@phosphor-icons/react";
import { ApiVolunteerGet, EntityTableName } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AddCommentButton,
  AuthorName,
  CommentContent,
  CommentItem,
  CommentText,
  Container,
  Header,
  IconContainer,
  MenuAction,
  NewCommentSection,
  TextArea,
  Timestamp,
  TitleRow,
  TopInfo,
} from "./styles";

type Props = {
  volunteer: ApiVolunteerGet;
};

export function CommentsSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const { mutate: createComment, isPending } = useCreateComment(volunteer.id);
  const [newCommentText, setNewCommentText] = useState("");

  const comments = volunteer.comments ?? [];

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    createComment(
      {
        text: newCommentText.trim(),
        entityType: EntityTableName.VOLUNTEER,
        entityId: volunteer.id,
      },
      {
        onSuccess: () => {
          setNewCommentText("");
        },
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <Container data-testid="comments-section-container">
      <Header>
        <TitleRow>
          <IconContainer>
            <ChatCircleDots size={40} weight="fill" />
          </IconContainer>
          <Heading2>
            {t("dashboard.volunteerProfile.commentsSection.title")} • {comments.length}
          </Heading2>
        </TitleRow>
      </Header>

      {comments.map((comment) => (
        <CommentItem key={comment.id}>
          <CommentContent>
            <TopInfo>
              <AuthorName>{comment.authorName}</AuthorName>
              <Timestamp>{formatDateTime(comment.timestamp)}</Timestamp>
            </TopInfo>
            <CommentText>{comment.content}</CommentText>
          </CommentContent>
          <MenuAction aria-label={t("dashboard.volunteerProfile.commentsSection.menuAction")}>
            <DotsThreeOutline size={24} weight="fill" />
          </MenuAction>
        </CommentItem>
      ))}

      <NewCommentSection>
        <TextArea
          placeholder={t("dashboard.volunteerProfile.commentsSection.placeholder")}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          onKeyPress={handleKeyPress}
          data-testid="comment-textarea"
        />
        <AddCommentButton
          $disabled={!newCommentText.trim() || isPending}
          onClick={handleAddComment}
          disabled={!newCommentText.trim() || isPending}
          data-testid="add-comment-button"
        >
          {t("dashboard.volunteerProfile.commentsSection.addComment")}
        </AddCommentButton>
      </NewCommentSection>
    </Container>
  );
}
