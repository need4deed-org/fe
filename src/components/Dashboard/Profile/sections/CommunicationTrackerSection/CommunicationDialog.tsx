"use client";
import { X } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const DialogOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-dimmed-background);
  z-index: 10001;
  justify-content: center;
  align-items: center;
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-48);
  gap: var(--spacing-24);
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  box-shadow: 0px 10px 30px -12px rgba(143, 81, 138, 0.2);
  max-width: 620px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const DialogHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-32);
`;

const DialogTitle = styled.h3`
  font-weight: 700;
  font-size: 28px;
  line-height: 32px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);

  &:hover {
    opacity: 0.7;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
`;

const Select = styled.select`
  padding: var(--spacing-16);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
  font-family: "Figtree";
  background: var(--color-white);

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }
`;

const Input = styled.input`
  padding: var(--spacing-16);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
  font-family: "Figtree";

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }
`;

const TextArea = styled.textarea`
  padding: var(--spacing-16);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
  font-family: "Figtree";
  min-height: 112px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--spacing-16);
  margin-top: var(--spacing-16);
`;

const CancelButton = styled.button`
  padding: var(--spacing-16) var(--spacing-24);
  background: transparent;
  border: 2px solid var(--color-aubergine);
  border-radius: var(--button-border-radius);
  cursor: pointer;
  font-weight: 600;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-aubergine);
  font-family: "Figtree";

  &:hover {
    background: var(--color-aubergine-subtle);
  }
`;

const SaveButton = styled.button`
  padding: var(--spacing-16) var(--spacing-24);
  background: var(--color-aubergine);
  border: none;
  border-radius: var(--button-border-radius);
  cursor: pointer;
  font-weight: 600;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-white);
  font-family: "Figtree";

  &:hover {
    background: var(--color-aubergine-light);
  }

  &:disabled {
    background: var(--color-grey-200);
    color: var(--color-grey-500);
    cursor: not-allowed;
  }
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CommunicationEntry) => void;
  initialData?: CommunicationEntry;
};

export type CommunicationEntry = {
  id?: number;
  date: string;
  type: string;
  contactMethod: string;
  notes: string;
};

export function CommunicationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CommunicationEntry>(
    initialData || {
      date: new Date().toISOString().split("T")[0],
      type: "status-change",
      contactMethod: "email",
      notes: "",
    }
  );

  const handleSave = () => {
    if (!formData.notes.trim()) return;
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "status-change",
      contactMethod: "email",
      notes: "",
    });
    onClose();
  };

  return (
    <DialogOverlay $isOpen={isOpen} onClick={handleClose} data-testid="communication-dialog-overlay">
      <DialogContainer onClick={(e) => e.stopPropagation()} data-testid="communication-dialog-container">
        <DialogHeader>
          <DialogTitle>{t("dashboard.volunteerProfile.communicationSection.registerContact", "Register contact")}</DialogTitle>
          <CloseButton onClick={handleClose} data-testid="close-dialog-button">
            <X size={24} weight="bold" />
          </CloseButton>
        </DialogHeader>

        <FormField>
          <Label>{t("dashboard.volunteerProfile.communicationSection.typeOfContact", "Type of contact")}</Label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            data-testid="contact-type-select"
          >
            <option value="status-change">{t("dashboard.volunteerProfile.communicationSection.statusChange", "Status change")}</option>
            <option value="follow-up">{t("dashboard.volunteerProfile.communicationSection.followUp", "Follow-up")}</option>
            <option value="inquiry">{t("dashboard.volunteerProfile.communicationSection.inquiry", "Inquiry")}</option>
            <option value="other">{t("dashboard.volunteerProfile.communicationSection.other", "Other")}</option>
          </Select>
        </FormField>

        <FormField>
          <Label>{t("dashboard.volunteerProfile.communicationSection.contactMethod", "Contact method")}</Label>
          <Select
            value={formData.contactMethod}
            onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
            data-testid="contact-method-select"
          >
            <option value="email">{t("dashboard.volunteerProfile.communicationSection.email", "Email")}</option>
            <option value="phone">{t("dashboard.volunteerProfile.communicationSection.phone", "Phone")}</option>
            <option value="in-person">{t("dashboard.volunteerProfile.communicationSection.inPerson", "In person")}</option>
            <option value="message">{t("dashboard.volunteerProfile.communicationSection.message", "Message")}</option>
          </Select>
        </FormField>

        <FormField>
          <Label>{t("dashboard.volunteerProfile.communicationSection.dateOfContact", "Date of contact")}</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            data-testid="contact-date-input"
          />
        </FormField>

        <FormField>
          <Label>{t("dashboard.volunteerProfile.communicationSection.notes", "Notes")}</Label>
          <TextArea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder={t("dashboard.volunteerProfile.communicationSection.notesPlaceholder", "Add notes about this communication...")}
            data-testid="contact-notes-textarea"
          />
        </FormField>

        <ButtonGroup>
          <CancelButton onClick={handleClose} data-testid="cancel-button">
            {t("dashboard.volunteerProfile.communicationSection.cancel", "Cancel")}
          </CancelButton>
          <SaveButton onClick={handleSave} disabled={!formData.notes.trim()} data-testid="save-button">
            {t("dashboard.volunteerProfile.communicationSection.save", "Save")}
          </SaveButton>
        </ButtonGroup>
      </DialogContainer>
    </DialogOverlay>
  );
}
