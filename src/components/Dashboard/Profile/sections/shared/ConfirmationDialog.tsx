import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
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

export function ConfirmationDialog({ title, message, confirmText, cancelText, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <Modal isOpen onClose={onCancel}>
      <div
        data-testid="confirmation-dialog"
        style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)" }}
      >
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button
            text={cancelText || t("dashboard.communicationSection.cancel", "Cancel")}
            onClick={onCancel}
            backgroundcolor="transparent"
            textColor="var(--color-aubergine)"
            border="var(--border-width-medium) solid var(--color-aubergine)"
          />
          <Button
            text={confirmText || t("dashboard.communicationSection.delete", "Delete")}
            onClick={onConfirm}
            backgroundcolor="var(--color-aubergine)"
            textColor="var(--color-white)"
          />
        </ButtonGroup>
      </div>
    </Modal>
  );
}
