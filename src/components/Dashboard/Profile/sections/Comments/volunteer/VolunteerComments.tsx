"use client";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useDeleteComment } from "@/hooks/useDeleteComment";
import { useUpdateComment } from "@/hooks/useUpdateComment";
import { ApiVolunteerGet, EntityTableName } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AddCommentButton,
  Comment,
  Container,
  DeleteCommentDialog,
  NewCommentSection,
  TextArea,
  useCommentDelete,
  useCommentEdit,
  useCommentMenu,
} from "../common";

type Props = {
  volunteer: ApiVolunteerGet;
};

export function VolunteerComments({ volunteer }: Props) {
  const { t } = useTranslation();
  const { mutate: createComment, isPending: isCreating } = useCreateComment(volunteer.id, "volunteer");
  const [newCommentText, setNewCommentText] = useState("");

  const edit = useCommentEdit();
  const deleteState = useCommentDelete();
  const menu = useCommentMenu();

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    volunteer.id,
    edit.editingCommentId ?? 0,
    "volunteer",
  );

  const { mutate: deleteComment } = useDeleteComment(volunteer.id, deleteState.deleteCommentId ?? 0, "volunteer");

  const comments = volunteer.comments?.slice().reverse() ?? [];

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    createComment(
      {
        text: newCommentText.trim(),
        entityType: EntityTableName.VOLUNTEER,
        entityId: volunteer.id,
      },
      {
        onSuccess: () => setNewCommentText(""),
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleSaveEdit = () => {
    if (!edit.editText.trim() || !edit.editingCommentId) return;

    updateComment(
      { text: edit.editText.trim() },
      {
        onSuccess: () => edit.cancelEdit(),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteState.deleteCommentId) return;

    deleteComment(undefined, {
      onSuccess: () => deleteState.closeDeleteDialog(),
    });
  };

  const handleEditClick = (commentId: number, currentText: string) => {
    edit.startEdit(commentId, currentText);
    menu.closeMenu();
  };

  const handleDeleteClick = (commentId: number, authorName: string) => {
    deleteState.openDeleteDialog(commentId, authorName);
    menu.closeMenu();
  };

  return (
    <Container data-testid="volunteer-comments-container">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          edit={{
            isActive: edit.editingCommentId === comment.id,
            text: edit.editText,
            canSave: edit.canSave,
            isUpdating,
            onTextChange: edit.updateEditText,
            onKeyPress: (e) => edit.handleKeyPress(e, handleSaveEdit),
            onSave: handleSaveEdit,
            onCancel: edit.cancelEdit,
          }}
          menu={{
            isOpen: menu.openMenuCommentId === comment.id,
            anchorElement: menu.menuButtonRefs.current[comment.id] ?? null,
            buttonRef: (el) => {
              menu.menuButtonRefs.current[comment.id] = el;
            },
            onToggle: (e) => {
              e.stopPropagation();
              menu.toggleMenu(comment.id);
            },
            onClose: menu.closeMenu,
            onEdit: () => handleEditClick(comment.id, comment.content),
            onDelete: () => handleDeleteClick(comment.id, comment.authorName),
          }}
        />
      ))}

      <NewCommentSection>
        <TextArea
          placeholder={t("dashboard.commentsSection.placeholder")}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          onKeyPress={handleKeyPress}
          data-testid="comment-textarea"
        />
        <AddCommentButton
          onClick={handleAddComment}
          disabled={!newCommentText.trim() || isCreating}
          data-testid="add-comment-button"
        >
          {t("dashboard.commentsSection.addComment")}
        </AddCommentButton>
      </NewCommentSection>

      <DeleteCommentDialog
        isOpen={deleteState.deleteDialogOpen}
        authorName={deleteState.deleteAuthorName}
        onCancel={deleteState.closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}
