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
  border-radius: 24px;
  padding: 48px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  font-family: "Figtree", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: var(--color-midnight);
  margin: 0 0 16px 0;
`;

const Message = styled.p`
  font-family: "Figtree", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-midnight);
  margin: 0 0 32px 0;
`;

export function DeleteConfirmationDialog({ isOpen, documentName, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <DialogOverlay isOpen={isOpen} onClose={onCancel} zIndex={10003}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{t("dashboard.volunteerProfile.documentSection.deleteDialog.title")}</Title>
        <Message>{t("dashboard.volunteerProfile.documentSection.deleteDialog.message", { documentName })}</Message>
        <DialogButtonGroup>
          <CancelButton onClick={onCancel}>
            {t("dashboard.volunteerProfile.documentSection.deleteDialog.cancel")}
          </CancelButton>
          <PrimaryButton onClick={onConfirm}>
            {t("dashboard.volunteerProfile.documentSection.deleteDialog.delete")}
          </PrimaryButton>
        </DialogButtonGroup>
      </Dialog>
    </DialogOverlay>
  );
}
