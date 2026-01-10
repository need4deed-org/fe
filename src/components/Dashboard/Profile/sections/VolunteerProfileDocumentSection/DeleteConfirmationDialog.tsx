import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { DialogOverlay } from "./shared/DialogOverlay";
import { DialogButtonGroup, CancelButton, PrimaryButton } from "./shared/DialogButtonGroup";

type Props = {
  isOpen: boolean;
  documentName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

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

export function DeleteConfirmationDialog({ isOpen, documentName, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <DialogOverlay isOpen={isOpen} onClose={onCancel} zIndex={10003}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{t("dashboard.documentSection.deleteDialog.title")}</Title>
        <Message>{t("dashboard.documentSection.deleteDialog.message", { documentName })}</Message>
        <DialogButtonGroup>
          <CancelButton onClick={onCancel}>
            {t("dashboard.documentSection.deleteDialog.cancel")}
          </CancelButton>
          <PrimaryButton onClick={onConfirm}>
            {t("dashboard.documentSection.deleteDialog.delete")}
          </PrimaryButton>
        </DialogButtonGroup>
      </Dialog>
    </DialogOverlay>
  );
}
