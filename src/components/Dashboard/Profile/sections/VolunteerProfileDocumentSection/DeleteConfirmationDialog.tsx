import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  isOpen: boolean;
  documentName: string;
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
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 10003;
`;

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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const CancelButton = styled.button`
  font-family: "Figtree", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-aubergine);
  background: transparent;
  border: 2px solid var(--color-aubergine);
  border-radius: 125px;
  padding: 12px 32px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-aubergine-subtle);
  }
`;

const DeleteButton = styled.button`
  font-family: "Figtree", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-white);
  background: var(--color-aubergine);
  border: 2px solid var(--color-aubergine);
  border-radius: 125px;
  padding: 12px 32px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-aubergine-light);
    border-color: var(--color-aubergine-light);
  }
`;

export function DeleteConfirmationDialog({ isOpen, documentName, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onCancel}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{t("dashboard.volunteerProfile.documentSection.deleteDialog.title")}</Title>
        <Message>{t("dashboard.volunteerProfile.documentSection.deleteDialog.message", { documentName })}</Message>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>
            {t("dashboard.volunteerProfile.documentSection.deleteDialog.cancel")}
          </CancelButton>
          <DeleteButton onClick={onConfirm}>
            {t("dashboard.volunteerProfile.documentSection.deleteDialog.delete")}
          </DeleteButton>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
}
