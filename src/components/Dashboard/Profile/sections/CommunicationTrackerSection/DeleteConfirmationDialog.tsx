import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ApiCommunicationGet } from "need4deed-sdk";
import { DialogOverlay } from "../VolunteerProfileDocumentSection/shared/DialogOverlay";
import { DialogButtonGroup, CancelButton, PrimaryButton } from "../VolunteerProfileDocumentSection/shared/DialogButtonGroup";
import { getDisplayLabel } from "./utils/translations";

type Props = {
  isOpen: boolean;
  communication: ApiCommunicationGet | null;
  onCancel: () => void;
  onConfirm: () => void;
};

const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-32);
  gap: var(--spacing-24);
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  box-shadow: var(--communication-tracker-dialog-box-shadow);
  max-width: var(--communication-tracker-delete-dialog-max-width);
  width: 90%;
`;

const Title = styled.h3`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-24);
  line-height: var(--line-height-32);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  margin: 0;
`;

const Message = styled.p`
  font-weight: var(--font-weight-regular);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  margin: 0;
`;

export function DeleteConfirmationDialog({ isOpen, communication, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

  if (!communication) return null;

  const entryLabel = getDisplayLabel(t, communication.contactType, communication.communicationType);

  return (
    <DialogOverlay isOpen={isOpen} onClose={onCancel} zIndex={10001}>
      <Dialog onClick={(e) => e.stopPropagation()} data-testid="delete-confirm-dialog">
        <Title>{t("dashboard.communicationSection.deleteConfirmTitle", "Delete entry?")}</Title>
        <Message>
          {t("dashboard.communicationSection.deleteConfirmText", {
            entryType: entryLabel,
            defaultValue: `"${entryLabel}" communication entry will be permanently deleted.`,
          })}
        </Message>
        <DialogButtonGroup>
          <CancelButton onClick={onCancel} data-testid="delete-cancel-button">
            {t("dashboard.communicationSection.cancel", "Cancel")}
          </CancelButton>
          <PrimaryButton onClick={onConfirm} data-testid="delete-confirm-button">
            {t("dashboard.communicationSection.delete", "Delete")}
          </PrimaryButton>
        </DialogButtonGroup>
      </Dialog>
    </DialogOverlay>
  );
}
