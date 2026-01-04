"use client";
import { Heading2 } from "@/components/styled/text";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useDeleteComment } from "@/hooks/useDeleteComment";
import { useUpdateComment } from "@/hooks/useUpdateComment";
import { formatDateTime } from "@/utils";
import { ChatCircleDots, DotsThreeOutline } from "@phosphor-icons/react";
import { ApiVolunteerGet, EntityTableName } from "need4deed-sdk";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommentActionMenu } from "./CommentActionMenu";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import {
  AddCommentButton,
  AuthorName,
  CommentContent,
  CommentEditButtons,
  CommentItem,
  CommentText,
  Container,
  EditCancelButton,
  EditSaveButton,
  EditTextArea,
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

type CommentState = {
  editingCommentId: number | null;
  editText: string;
  openMenuCommentId: number | null;
  deleteDialogOpen: boolean;
  deleteCommentId: number | null;
  deleteAuthorName: string;
};

export function CommentsSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const { mutate: createComment, isPending: isCreating } = useCreateComment(volunteer.id);
  const [newCommentText, setNewCommentText] = useState("");

  const [state, setState] = useState<CommentState>({
    editingCommentId: null,
    editText: "",
    openMenuCommentId: null,
    deleteDialogOpen: false,
    deleteCommentId: null,
    deleteAuthorName: "",
  });

  const menuButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const comments = [...(volunteer.comments ?? [])].reverse();

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

  const handleMenuClick = (commentId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setState((prev) => ({
      ...prev,
      openMenuCommentId: prev.openMenuCommentId === commentId ? null : commentId,
    }));
  };

  const handleMenuClose = () => {
    setState((prev) => ({
      ...prev,
      openMenuCommentId: null,
    }));
  };

  const handleEditClick = (commentId: number, currentText: string) => {
    setState((prev) => ({
      ...prev,
      editingCommentId: commentId,
      editText: currentText,
      openMenuCommentId: null,
    }));
  };

  const handleCancelEdit = () => {
    setState((prev) => ({
      ...prev,
      editingCommentId: null,
      editText: "",
    }));
  };

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    volunteer.id,
    state.editingCommentId ?? 0,
  );

  const handleSaveEdit = () => {
    if (!state.editText.trim() || !state.editingCommentId) return;

    updateComment(
      { text: state.editText.trim() },
      {
        onSuccess: () => {
          setState((prev) => ({
            ...prev,
            editingCommentId: null,
            editText: "",
          }));
        },
      },
    );
  };

  const handleDeleteClick = (commentId: number, authorName: string) => {
    setState((prev) => ({
      ...prev,
      deleteDialogOpen: true,
      deleteCommentId: commentId,
      deleteAuthorName: authorName,
      openMenuCommentId: null,
    }));
  };

  const handleCancelDelete = () => {
    setState((prev) => ({
      ...prev,
      deleteDialogOpen: false,
      deleteCommentId: null,
      deleteAuthorName: "",
    }));
  };

  const { mutate: deleteComment } = useDeleteComment(volunteer.id, state.deleteCommentId ?? 0);

  const handleConfirmDelete = () => {
    if (!state.deleteCommentId) return;

    deleteComment(undefined, {
      onSuccess: () => {
        setState((prev) => ({
          ...prev,
          deleteDialogOpen: false,
          deleteCommentId: null,
          deleteAuthorName: "",
        }));
      },
    });
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

      {comments.map((comment) => {
        const isEditing = state.editingCommentId === comment.id;
        const isMenuOpen = state.openMenuCommentId === comment.id;

        return (
          <CommentItem key={comment.id}>
            <CommentContent>
              <TopInfo>
                <AuthorName>{comment.authorName}</AuthorName>
                <Timestamp>{formatDateTime(comment.timestamp)}</Timestamp>
              </TopInfo>
              {isEditing ? (
                <>
                  <EditTextArea
                    value={state.editText}
                    onChange={(e) => setState((prev) => ({ ...prev, editText: e.target.value }))}
                    data-testid={`edit-comment-textarea-${comment.id}`}
                  />
                  <CommentEditButtons>
                    <EditCancelButton onClick={handleCancelEdit} data-testid={`cancel-edit-${comment.id}`}>
                      {t("dashboard.volunteerProfile.commentsSection.cancelEdit")}
                    </EditCancelButton>
                    <EditSaveButton
                      onClick={handleSaveEdit}
                      disabled={!state.editText.trim() || isUpdating}
                      $disabled={!state.editText.trim() || isUpdating}
                      data-testid={`save-edit-${comment.id}`}
                    >
                      {t("dashboard.volunteerProfile.commentsSection.saveEdit")}
                    </EditSaveButton>
                  </CommentEditButtons>
                </>
              ) : (
                <CommentText>{comment.content}</CommentText>
              )}
            </CommentContent>
            {!isEditing && (
              <>
                <MenuAction
                  ref={(el) => {
                    menuButtonRefs.current[comment.id] = el;
                  }}
                  onClick={(e) => handleMenuClick(comment.id, e)}
                  aria-label={t("dashboard.volunteerProfile.commentsSection.menuAction")}
                  data-testid={`comment-menu-${comment.id}`}
                >
                  <DotsThreeOutline size={24} weight="fill" />
                </MenuAction>
                <CommentActionMenu
                  isOpen={isMenuOpen}
                  onClose={handleMenuClose}
                  onEdit={() => handleEditClick(comment.id, comment.content)}
                  onDelete={() => handleDeleteClick(comment.id, comment.authorName)}
                  anchorElement={menuButtonRefs.current[comment.id]}
                />
              </>
            )}
          </CommentItem>
        );
      })}

      <NewCommentSection>
        <TextArea
          placeholder={t("dashboard.volunteerProfile.commentsSection.placeholder")}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          onKeyPress={handleKeyPress}
          data-testid="comment-textarea"
        />
        <AddCommentButton
          $disabled={!newCommentText.trim() || isCreating}
          onClick={handleAddComment}
          disabled={!newCommentText.trim() || isCreating}
          data-testid="add-comment-button"
        >
          {t("dashboard.volunteerProfile.commentsSection.addComment")}
        </AddCommentButton>
      </NewCommentSection>

      <DeleteCommentDialog
        isOpen={state.deleteDialogOpen}
        authorName={state.deleteAuthorName}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}
