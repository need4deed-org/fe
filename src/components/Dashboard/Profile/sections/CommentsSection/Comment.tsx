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

type EditState = {
  isActive: boolean;
  text: string;
  canSave: boolean;
  isUpdating: boolean;
  onTextChange: (text: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
};

type MenuState = {
  isOpen: boolean;
  anchorElement: HTMLButtonElement | null;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

type Props = {
  comment: TimedText;
  edit: EditState;
  menu: MenuState;
};

export function Comment({ comment, edit, menu }: Props) {
  const { t } = useTranslation();

  return (
    <CommentItem>
      <CommentContent>
        <TopInfo>
          <AuthorName>{comment.authorName}</AuthorName>
          <Timestamp>{formatDateTime(comment.timestamp)}</Timestamp>
        </TopInfo>
        {edit.isActive ? (
          <>
            <TextArea
              value={edit.text}
              onChange={(e) => edit.onTextChange(e.target.value)}
              onKeyPress={edit.onKeyPress}
              data-testid={`edit-comment-textarea-${comment.id}`}
            />
            <CommentEditButtons>
              <EditCancelButton onClick={edit.onCancel} data-testid={`cancel-edit-${comment.id}`}>
                {t("dashboard.commentsSection.cancelEdit")}
              </EditCancelButton>
              <EditSaveButton
                onClick={edit.onSave}
                disabled={!edit.canSave || edit.isUpdating}
                data-testid={`save-edit-${comment.id}`}
              >
                {t("dashboard.commentsSection.saveEdit")}
              </EditSaveButton>
            </CommentEditButtons>
          </>
        ) : (
          <CommentText>{comment.content}</CommentText>
        )}
      </CommentContent>
      {!edit.isActive && (
        <>
          <MenuAction
            ref={menu.buttonRef}
            onClick={menu.onToggle}
            aria-label={t("dashboard.commentsSection.menuAction")}
            data-testid={`comment-menu-${comment.id}`}
          >
            <DotsThreeOutline size={24} weight="fill" />
          </MenuAction>
          <CommentActionMenu
            isOpen={menu.isOpen}
            onClose={menu.onClose}
            onEdit={menu.onEdit}
            onDelete={menu.onDelete}
            anchorElement={menu.anchorElement}
          />
        </>
      )}
    </CommentItem>
  );
}
