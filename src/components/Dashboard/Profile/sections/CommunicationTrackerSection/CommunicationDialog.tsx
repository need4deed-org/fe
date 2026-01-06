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

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  cursor: pointer;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  font-weight: 400;
`;

const RadioInput = styled.input`
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: var(--color-aubergine);
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
    opacity: 0.6;
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
  const [selectedOption, setSelectedOption] = useState<string>(initialData?.type || "called");

  const handleSave = () => {
    const entry: CommunicationEntry = {
      id: initialData?.id,
      date: new Date().toISOString().split("T")[0],
      type: selectedOption,
      contactMethod: selectedOption === "called" || selectedOption === "triedToCall" ? "phone" : "email",
      notes: t(`dashboard.volunteerProfile.communicationSection.contactTypes.${selectedOption}`, selectedOption),
    };
    onSave(entry);
    onClose();
  };

  const handleClose = () => {
    setSelectedOption("called");
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

        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="contactType"
              value="called"
              checked={selectedOption === "called"}
              onChange={(e) => setSelectedOption(e.target.value)}
              data-testid="radio-called"
            />
            {t("dashboard.volunteerProfile.communicationSection.contactTypes.called", "Called")}
          </RadioOption>

          <RadioOption>
            <RadioInput
              type="radio"
              name="contactType"
              value="triedToCall"
              checked={selectedOption === "triedToCall"}
              onChange={(e) => setSelectedOption(e.target.value)}
              data-testid="radio-tried-to-call"
            />
            {t("dashboard.volunteerProfile.communicationSection.contactTypes.triedToCall", "Tried to call")}
          </RadioOption>

          <RadioOption>
            <RadioInput
              type="radio"
              name="contactType"
              value="textedOrEmailed"
              checked={selectedOption === "textedOrEmailed"}
              onChange={(e) => setSelectedOption(e.target.value)}
              data-testid="radio-texted-or-emailed"
            />
            {t("dashboard.volunteerProfile.communicationSection.contactTypes.textedOrEmailed", "Texted or emailed")}
          </RadioOption>

          <RadioOption>
            <RadioInput
              type="radio"
              name="contactType"
              value="other"
              checked={selectedOption === "other"}
              onChange={(e) => setSelectedOption(e.target.value)}
              data-testid="radio-other"
            />
            {t("dashboard.volunteerProfile.communicationSection.contactTypes.other", "Other")}
          </RadioOption>
        </RadioGroup>

        <ButtonGroup>
          <CancelButton onClick={handleClose} data-testid="cancel-button">
            {t("dashboard.volunteerProfile.communicationSection.cancel", "Cancel")}
          </CancelButton>
          <SaveButton onClick={handleSave} data-testid="save-button">
            {t("dashboard.volunteerProfile.communicationSection.save", "Save")}
          </SaveButton>
        </ButtonGroup>
      </DialogContainer>
    </DialogOverlay>
  );
}
