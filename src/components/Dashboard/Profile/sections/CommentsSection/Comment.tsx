import { formatDateTime } from "@/utils";
import { DotsThreeOutline } from "@phosphor-icons/react";
import { TimedText } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { CommentActionMenu } from "./CommentActionMenu";
import {
  AuthorName,
  CommentContent,
  CommentEditButtons,
  CommentItem,
  CommentText,
  EditCancelButton,
  EditSaveButton,
  MenuAction,
  TextArea,
  Timestamp,
  TopInfo,
} from "./styles";

type Props = {
  comment: TimedText;
  isEditing: boolean;
  editText: string;
  isMenuOpen: boolean;
  anchorElement: HTMLButtonElement | null;
  menuButtonRef: (el: HTMLButtonElement | null) => void;
  onEditTextChange: (text: string) => void;
  onEditKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMenuClose: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  canSave: boolean;
  isUpdating: boolean;
};

export function Comment({
  comment,
  isEditing,
  editText,
  isMenuOpen,
  anchorElement,
  menuButtonRef,
  onEditTextChange,
  onEditKeyPress,
  onMenuClick,
  onMenuClose,
  onEditClick,
  onDeleteClick,
  onCancelEdit,
  onSaveEdit,
  canSave,
  isUpdating,
}: Props) {
  const { t } = useTranslation();

  return (
    <CommentItem>
      <CommentContent>
        <TopInfo>
          <AuthorName>{comment.authorName}</AuthorName>
          <Timestamp>{formatDateTime(comment.timestamp)}</Timestamp>
        </TopInfo>
        {isEditing ? (
          <>
            <TextArea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyPress={onEditKeyPress}
              data-testid={`edit-comment-textarea-${comment.id}`}
            />
            <CommentEditButtons>
              <EditCancelButton onClick={onCancelEdit} data-testid={`cancel-edit-${comment.id}`}>
                {t("dashboard.volunteerProfile.commentsSection.cancelEdit")}
              </EditCancelButton>
              <EditSaveButton
                onClick={onSaveEdit}
                disabled={!canSave || isUpdating}
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
            ref={menuButtonRef}
            onClick={onMenuClick}
            aria-label={t("dashboard.volunteerProfile.commentsSection.menuAction")}
            data-testid={`comment-menu-${comment.id}`}
          >
            <DotsThreeOutline size={24} weight="fill" />
          </MenuAction>
          <CommentActionMenu
            isOpen={isMenuOpen}
            onClose={onMenuClose}
            onEdit={onEditClick}
            onDelete={onDeleteClick}
            anchorElement={anchorElement}
          />
        </>
      )}
    </CommentItem>
  );
}
