import { useTranslation } from "react-i18next";
import { CommentEditButtons, EditCancelButton, EditSaveButton, TextArea } from "./styles";

type EditState = {
  text: string;
  canSave: boolean;
  isUpdating: boolean;
  onTextChange: (text: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
};

type Props = {
  commentId: string | number;
  edit: EditState;
};

export function CommentEdit({ commentId, edit }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <TextArea
        value={edit.text}
        onChange={(e) => edit.onTextChange(e.target.value)}
        onKeyPress={edit.onKeyPress}
        data-testid={`edit-comment-textarea-${commentId}`}
      />
      <CommentEditButtons>
        <EditCancelButton onClick={edit.onCancel} data-testid={`cancel-edit-${commentId}`}>
          {t("dashboard.commentsSection.cancelEdit")}
        </EditCancelButton>
        <EditSaveButton
          onClick={edit.onSave}
          disabled={!edit.canSave || edit.isUpdating}
          data-testid={`save-edit-${commentId}`}
        >
          {t("dashboard.commentsSection.saveEdit")}
        </EditSaveButton>
      </CommentEditButtons>
    </>
  );
}
