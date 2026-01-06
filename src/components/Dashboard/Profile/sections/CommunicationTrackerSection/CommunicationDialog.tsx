"use client";
import { X } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { de } from "date-fns/locale";

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
  align-items: flex-start;
  flex-direction: column;
  gap: var(--spacing-16);
  cursor: pointer;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  font-weight: 400;
`;

const RadioRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

const RadioInput = styled.input`
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: var(--color-aubergine);
  flex-shrink: 0;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  width: 100%;
  margin-left: 32px;
`;

const Label = styled.label`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
`;

const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  .react-datepicker {
    font-family: "Figtree";
    border: 1px solid var(--color-grey-200);
    border-radius: var(--border-radius-small);
  }

  .react-datepicker__header {
    background-color: var(--color-white);
    border-bottom: 1px solid var(--color-grey-200);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: var(--color-aubergine);
  }

  .react-datepicker__day:hover {
    background-color: var(--color-aubergine-subtle);
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: var(--spacing-16);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
  font-family: "Figtree";
  cursor: pointer;
  background: var(--color-white);

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }

  &::placeholder {
    color: var(--color-grey-500);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-16);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
  font-family: "Figtree";
  background: var(--color-white);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }
`;

const QuestionText = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.005em;
  color: var(--color-midnight);
  margin-bottom: var(--spacing-8);
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
  const { t, i18n } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string>(initialData?.type || "called");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState<string>("phoneNumber");

  const handleSave = () => {
    const entry: CommunicationEntry = {
      id: initialData?.id,
      date: selectedDate.toISOString().split("T")[0],
      type: selectedOption,
      contactMethod: selectedPlatform,
      notes: t(`dashboard.volunteerProfile.communicationSection.contactTypes.${selectedOption}`, selectedOption),
    };
    onSave(entry);
    handleClose();
  };

  const handleClose = () => {
    setSelectedOption("called");
    setSelectedDate(new Date());
    setSelectedPlatform("phoneNumber");
    onClose();
  };

  const showAdditionalFields = selectedOption === "called" || selectedOption === "triedToCall";
  const locale = i18n.language === "de" ? de : undefined;

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
            <RadioRow>
              <RadioInput
                type="radio"
                name="contactType"
                value="called"
                checked={selectedOption === "called"}
                onChange={(e) => setSelectedOption(e.target.value)}
                data-testid="radio-called"
              />
              {t("dashboard.volunteerProfile.communicationSection.contactTypes.called", "Called")}
            </RadioRow>
            {selectedOption === "called" && showAdditionalFields && (
              <>
                <FormField>
                  <Label>{t("dashboard.volunteerProfile.communicationSection.contactDateRequired", "Contact date*")}</Label>
                  <DatePickerWrapper>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => date && setSelectedDate(date)}
                      dateFormat="dd.MM.yyyy"
                      locale={locale}
                      customInput={<DateInput data-testid="date-picker-input" />}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </DatePickerWrapper>
                </FormField>
                <FormField>
                  <QuestionText>{t("dashboard.volunteerProfile.communicationSection.whatPlatform", "What platform did you use?")}</QuestionText>
                  <Label>{t("dashboard.volunteerProfile.communicationSection.contactMethodRequired", "Contact method*")}</Label>
                  <Select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    data-testid="platform-select"
                  >
                    <option value="phoneNumber">
                      {t("dashboard.volunteerProfile.communicationSection.platformOptions.phoneNumber", "Phone number")}
                    </option>
                    <option value="telegram">
                      {t("dashboard.volunteerProfile.communicationSection.platformOptions.telegram", "Telegram")}
                    </option>
                    <option value="whatsapp">
                      {t("dashboard.volunteerProfile.communicationSection.platformOptions.whatsapp", "Whatsapp")}
                    </option>
                    <option value="signal">
                      {t("dashboard.volunteerProfile.communicationSection.platformOptions.signal", "Signal")}
                    </option>
                  </Select>
                </FormField>
              </>
            )}
          </RadioOption>

          <RadioOption>
            <RadioRow>
              <RadioInput
                type="radio"
                name="contactType"
                value="triedToCall"
                checked={selectedOption === "triedToCall"}
                onChange={(e) => setSelectedOption(e.target.value)}
                data-testid="radio-tried-to-call"
              />
              {t("dashboard.volunteerProfile.communicationSection.contactTypes.triedToCall", "Tried to call")}
            </RadioRow>
            {selectedOption === "triedToCall" && showAdditionalFields && (
              <>
                <FormField>
                  <Label>{t("dashboard.volunteerProfile.communicationSection.contactDateRequired", "Contact date*")}</Label>
                  <DatePickerWrapper>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => date && setSelectedDate(date)}
                      dateFormat="dd.MM.yyyy"
                      locale={locale}
                      customInput={<DateInput data-testid="date-picker-input" />}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </DatePickerWrapper>
                </FormField>
                <FormField>
                  <QuestionText>{t("dashboard.volunteerProfile.communicationSection.whatPlatform", "What platform did you use?")}</QuestionText>
                  <Label>{t("dashboard.volunteerProfile.communicationSection.contactMethodRequired", "Contact method*")}</Label>
                  <Select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    data-testid="platform-select"
                  >
                    <option value="phoneNumber">
                      {t("dashboard.volunteerProfile.communicationSection.platformOptions.phoneNumber", "Phone number")}
                    </option>
                    <option value="telegram">
                      {t("dashboard.volunteerProfile.communicationSection.platformOptions.telegram", "Telegram")}
                    </option>
                    <option value="whatsapp">
                      {t("dashboard.volunteerProfile.communicationSection.platformOptions.whatsapp", "Whatsapp")}
                    </option>
                    <option value="signal">
                      {t("dashboard.volunteerProfile.communicationSection.platformOptions.signal", "Signal")}
                    </option>
                  </Select>
                </FormField>
              </>
            )}
          </RadioOption>

          <RadioOption>
            <RadioRow>
              <RadioInput
                type="radio"
                name="contactType"
                value="textedOrEmailed"
                checked={selectedOption === "textedOrEmailed"}
                onChange={(e) => setSelectedOption(e.target.value)}
                data-testid="radio-texted-or-emailed"
              />
              {t("dashboard.volunteerProfile.communicationSection.contactTypes.textedOrEmailed", "Texted or emailed")}
            </RadioRow>
          </RadioOption>

          <RadioOption>
            <RadioRow>
              <RadioInput
                type="radio"
                name="contactType"
                value="other"
                checked={selectedOption === "other"}
                onChange={(e) => setSelectedOption(e.target.value)}
                data-testid="radio-other"
              />
              {t("dashboard.volunteerProfile.communicationSection.contactTypes.other", "Other")}
            </RadioRow>
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
