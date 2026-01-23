"use client";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { Modal } from "@/components/core/modal/Modal";
import {
  CancelButton,
  DialogButtonGroup,
  LargePrimaryButton,
} from "../VolunteerProfileDocumentSection/shared/DialogButtonGroup";
import { VolunteerStateEngagementType } from "need4deed-sdk";
import { Locale } from "date-fns";
import { TFunction } from "i18next";
import styled from "styled-components";

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-gap);
  padding: 0;
  height: 100%;
`;

const ModalTitle = styled.h3`
  font-size: var(--dialog-title-font-size);
  font-weight: var(--font-weight-bold);
  line-height: var(--dialog-title-line-height);
  letter-spacing: var(--dialog-title-letter-spacing);
  color: var(--color-blue-700);
  margin: 0;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-gap);
`;

const OptionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dialog-option-gap);
`;

const RadioOption = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dialog-option-gap);
  cursor: pointer;

  input[type="radio"] {
    appearance: none;
    width: var(--dialog-radio-size);
    height: var(--dialog-radio-size);
    border: var(--dialog-radio-border-width) solid var(--color-grey-400);
    border-radius: var(--percent-50);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;

    &:checked {
      border-color: var(--color-blue-700);

      &::after {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: var(--percent-50);
        background-color: var(--color-blue-700);
        top: var(--percent-50);
        left: var(--percent-50);
        transform: translate(-50%, -50%);
      }
    }
  }
`;

const OptionLabel = styled.span`
  font-size: var(--dialog-label-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--dialog-label-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  flex: 1;
`;

const OptionDescription = styled.p`
  font-size: var(--dialog-description-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--dialog-description-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-grey-700);
  margin: 0;
`;

const DateFieldContainer = styled.div`
  margin-top: var(--spacing-8);
`;

const ENGAGEMENT_DESCRIPTION_KEYS: Record<VolunteerStateEngagementType, string> = {
  [VolunteerStateEngagementType.NEW]: "new_description",
  [VolunteerStateEngagementType.ACTIVE]: "active_description",
  [VolunteerStateEngagementType.AVAILABLE]: "available_description",
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: "tempUnavailable_description",
  [VolunteerStateEngagementType.INACTIVE]: "inactive_description",
  [VolunteerStateEngagementType.UNRESPONSIVE]: "unresponsive_description",
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  statusEngagement: VolunteerStateEngagementType;
  onStatusChange: (status: VolunteerStateEngagementType) => void;
  returnDate: Date | undefined;
  onReturnDateChange: (date: Date | undefined) => void;
  initialReturnDate: Date | undefined;
  originalStatus: VolunteerStateEngagementType;
  engagementLabelMap: Record<VolunteerStateEngagementType, string>;
  locale: Locale;
  t: TFunction;
};

export const ChangeEngagementStatusDialog = ({
  isOpen,
  onClose,
  onSave,
  statusEngagement,
  onStatusChange,
  returnDate,
  onReturnDateChange,
  initialReturnDate,
  originalStatus,
  engagementLabelMap,
  locale,
  t,
}: Props) => {
  const getEngagementDescription = (status: VolunteerStateEngagementType): string => {
    const key = ENGAGEMENT_DESCRIPTION_KEYS[status];
    return t(`dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.${key}`);
  };

  const isSaveDisabled =
    statusEngagement === originalStatus &&
    (statusEngagement !== VolunteerStateEngagementType.TEMP_UNAVAILABLE ||
      returnDate?.getTime() === initialReturnDate?.getTime());

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContainer data-testid="change-engagement-status-dialog">
        <ModalTitle>{t("dashboard.volunteerProfile.volunteerHeader.modalData.title")}</ModalTitle>

        <OptionsContainer>
          {Object.values(VolunteerStateEngagementType).map((status) => (
            <OptionItem key={status}>
              <RadioOption>
                <input
                  type="radio"
                  name="engagement-status"
                  checked={statusEngagement === status}
                  onChange={() => onStatusChange(status)}
                />
                <OptionLabel>{engagementLabelMap[status]}</OptionLabel>
              </RadioOption>
              <OptionDescription>{getEngagementDescription(status)}</OptionDescription>
              {status === VolunteerStateEngagementType.TEMP_UNAVAILABLE && statusEngagement === status && (
                <DateFieldContainer>
                  <DatePickerWithLabel
                    date={returnDate}
                    onSelect={onReturnDateChange}
                    locale={locale}
                    allowFuture={true}
                    label={t(
                      "dashboard.volunteerProfile.volunteerHeader.modalData.options.returnDate",
                      "Return date (optional)",
                    )}
                  />
                </DateFieldContainer>
              )}
            </OptionItem>
          ))}
        </OptionsContainer>

        <DialogButtonGroup>
          <CancelButton onClick={onClose}>
            {t("dashboard.volunteerProfile.volunteerHeader.modalData.cancel")}
          </CancelButton>
          <LargePrimaryButton onClick={onSave} disabled={isSaveDisabled} $disabled={isSaveDisabled}>
            {t("dashboard.volunteerProfile.volunteerHeader.modalData.save")}
          </LargePrimaryButton>
        </DialogButtonGroup>
      </ModalContainer>
    </Modal>
  );
};
