"use client";
import { Heading2 } from "@/components/styled/text";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useDeleteComment } from "@/hooks/useDeleteComment";
import { useUpdateComment } from "@/hooks/useUpdateComment";
import { ChatCircleDots } from "@phosphor-icons/react";
import { ApiVolunteerGet, EntityTableName } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Comment } from "./Comment";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { useCommentDelete } from "./hooks/useCommentDelete";
import { useCommentEdit } from "./hooks/useCommentEdit";
import { useCommentMenu } from "./hooks/useCommentMenu";
import {
  AddCommentButton,
  Container,
  Header,
  IconContainer,
  NewCommentSection,
  TextArea,
  TitleRow,
} from "./styles";

type Props = {
  volunteer: ApiVolunteerGet;
};

export function CommentsSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const { mutate: createComment, isPending: isCreating } = useCreateComment(volunteer.id);
  const [newCommentText, setNewCommentText] = useState("");

  const edit = useCommentEdit();
  const deleteState = useCommentDelete();
  const menu = useCommentMenu();

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    volunteer.id,
    edit.editingCommentId ?? 0,
  );

  const { mutate: deleteComment } = useDeleteComment(volunteer.id, deleteState.deleteCommentId ?? 0);

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
        <Comment
          key={comment.id}
          comment={comment}
          isEditing={edit.editingCommentId === comment.id}
          editText={edit.editText}
          isMenuOpen={menu.openMenuCommentId === comment.id}
          anchorElement={menu.menuButtonRefs.current[comment.id] ?? null}
          menuButtonRef={(el) => {
            menu.menuButtonRefs.current[comment.id] = el;
          }}
          onEditTextChange={edit.updateEditText}
          onEditKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSaveEdit();
            }
          }}
          onMenuClick={(e) => {
            e.stopPropagation();
            menu.toggleMenu(comment.id);
          }}
          onMenuClose={menu.closeMenu}
          onEditClick={() => handleEditClick(comment.id, comment.content)}
          onDeleteClick={() => handleDeleteClick(comment.id, comment.authorName)}
          onCancelEdit={edit.cancelEdit}
          onSaveEdit={handleSaveEdit}
          canSave={edit.canSave}
          isUpdating={isUpdating}
        />
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
          onClick={handleAddComment}
          disabled={!newCommentText.trim() || isCreating}
          data-testid="add-comment-button"
        >
          {t("dashboard.volunteerProfile.commentsSection.addComment")}
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
