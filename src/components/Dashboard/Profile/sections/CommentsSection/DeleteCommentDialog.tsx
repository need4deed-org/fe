import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  isOpen: boolean;
  authorName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--document-dialog-overlay-background);
  justify-content: center;
  align-items: center;
  z-index: 10003;
`;

const Dialog = styled.div`
  background: var(--color-white);
  border-radius: var(--document-dialog-border-radius);
  padding: var(--document-dialog-padding);
  max-width: var(--document-dialog-max-width);
  width: var(--document-dialog-width);
  box-shadow: var(--document-dialog-shadow);
`;

const Title = styled.h2`
  font-weight: var(--document-dialog-title-font-weight);
  font-size: var(--document-dialog-title-font-size);
  line-height: var(--document-dialog-title-line-height);
  color: var(--color-midnight);
  margin: 0 0 var(--document-dialog-title-margin-bottom) 0;
`;

const Message = styled.p`
  font-weight: var(--document-dialog-message-font-weight);
  font-size: var(--document-dialog-message-font-size);
  line-height: var(--document-dialog-message-line-height);
  color: var(--color-midnight);
  margin: 0 0 var(--document-dialog-message-margin-bottom) 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--document-dialog-button-gap);
`;

const CancelButton = styled.button`
  font-weight: var(--document-dialog-button-font-weight);
  font-size: var(--document-dialog-button-font-size);
  line-height: var(--document-dialog-button-line-height);
  color: var(--color-aubergine);
  background: transparent;
  border: var(--document-dialog-button-border-width) solid var(--color-aubergine);
  border-radius: var(--document-dialog-button-border-radius);
  padding: var(--document-dialog-button-padding);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-aubergine-subtle);
  }
`;

const DeleteButton = styled.button`
  font-weight: var(--document-dialog-button-font-weight);
  font-size: var(--document-dialog-button-font-size);
  line-height: var(--document-dialog-button-line-height);
  color: var(--color-white);
  background: var(--color-aubergine);
  border: var(--document-dialog-button-border-width) solid var(--color-aubergine);
  border-radius: var(--document-dialog-button-border-radius);
  padding: var(--document-dialog-button-padding);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-aubergine-light);
    border-color: var(--color-aubergine-light);
  }
`;

export function DeleteCommentDialog({ isOpen, authorName, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onCancel}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{t("dashboard.volunteerProfile.commentsSection.deleteDialog.title")}</Title>
        <Message>{t("dashboard.volunteerProfile.commentsSection.deleteDialog.message", { authorName })}</Message>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>
            {t("dashboard.volunteerProfile.commentsSection.deleteDialog.cancel")}
          </CancelButton>
          <DeleteButton onClick={onConfirm}>
            {t("dashboard.volunteerProfile.commentsSection.deleteDialog.delete")}
          </DeleteButton>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
}
