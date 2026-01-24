"use client";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { Modal } from "@/components/core/modal/Modal";
import {
  CancelButton,
  DialogButtonGroup,
  LargePrimaryButton,
} from "../VolunteerProfileDocumentSection/shared/DialogButtonGroup";
import { de, enUS } from "date-fns/locale";
import { VolunteerStateEngagementType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { createEngagementLabelMap, ENGAGEMENT_DESCRIPTION_KEYS } from "./constants";
import {
  DateFieldContainer,
  ModalContainer,
  ModalTitle,
  OptionDescription,
  OptionItem,
  OptionLabel,
  OptionsContainer,
  RadioOption,
} from "./dialogStyles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  statusEngagement: VolunteerStateEngagementType;
  onStatusChange: (status: VolunteerStateEngagementType) => void;
  dateReturn: Date | undefined;
  onDateReturnChange: (date: Date | undefined) => void;
  isSaveDisabled: boolean;
};

export const ChangeEngagementStatusDialog = ({
  isOpen,
  onClose,
  onSave,
  statusEngagement,
  onStatusChange,
  dateReturn,
  onDateReturnChange,
  isSaveDisabled,
}: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;
  const engagementLabelMap = createEngagementLabelMap(t);

  const getEngagementDescription = (status: VolunteerStateEngagementType): string => {
    const key = ENGAGEMENT_DESCRIPTION_KEYS[status];
    return t(`dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.${key}`);
  };

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
                    date={dateReturn}
                    onSelect={onDateReturnChange}
                    locale={locale}
                    allowFuture={true}
                    label={t(
                      "dashboard.volunteerProfile.volunteerHeader.modalData.options.dateReturn",
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
