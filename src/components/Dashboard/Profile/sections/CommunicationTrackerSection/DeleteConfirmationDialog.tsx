import styled from "styled-components";
import { ApiCommunicationGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/core/modal";
import { Button } from "@/components/core/button";
import { getDisplayLabel } from "./utils/translations";

type Props = {
  isOpen: boolean;
  communication: ApiCommunicationGet | null;
  onCancel: () => void;
  onConfirm: () => void;
};

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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-16);
  margin-top: var(--spacing-24);
`;

export function DeleteConfirmationDialog({ isOpen, communication, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

  if (!communication) return null;

  const entryLabel = getDisplayLabel(t, communication.contactType, communication.communicationType);

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div data-testid="delete-confirm-dialog" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-24)' }}>
        <Title>{t("dashboard.communicationSection.deleteConfirmTitle", "Delete entry?")}</Title>
        <Message>
          {t("dashboard.communicationSection.deleteConfirmText", {
            entryType: entryLabel,
            defaultValue: `"${entryLabel}" communication entry will be permanently deleted.`,
          })}
        </Message>
        <ButtonGroup>
          <Button
            text={t("dashboard.communicationSection.cancel", "Cancel")}
            onClick={onCancel}
            backgroundcolor="transparent"
            textColor="var(--color-aubergine)"
            border="var(--border-width-medium) solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.communicationSection.delete", "Delete")}
            onClick={onConfirm}
            backgroundcolor="var(--color-aubergine)"
            textColor="var(--color-white)"
          />
        </ButtonGroup>
      </div>
    </Modal>
  );
}
