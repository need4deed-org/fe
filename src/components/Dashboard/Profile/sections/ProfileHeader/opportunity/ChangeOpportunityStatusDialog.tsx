"use client";
import { Modal } from "@/components/core/modal/Modal";
import { OpportunityStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import {
  CancelButton,
  DialogButtonGroup,
  LargePrimaryButton,
} from "../../VolunteerProfileDocument/shared/DialogButtonGroup";
import {
  ModalContainer,
  ModalTitle,
  OptionDescription,
  OptionItem,
  OptionLabel,
  OptionsContainer,
  RadioOption,
} from "../common";
import { UseOpportunityStatusDialogReturn } from "./useOpportunityStatusDialog";

const STATUS_DESCRIPTION_KEYS: Record<OpportunityStatusType, string> = {
  [OpportunityStatusType.NEW]: "new_description",
  [OpportunityStatusType.ACTIVE]: "active_description",
  [OpportunityStatusType.PAST]: "past_description",
};

type Props = {
  dialog: UseOpportunityStatusDialogReturn;
};

export const ChangeOpportunityStatusDialog = ({
  dialog: { isOpen, closeDialog, statusOpportunity, setStatusOpportunity, saveDialog, isSaveDisabled },
}: Props) => {
  const { t } = useTranslation();

  const statusLabelMap = {
    [OpportunityStatusType.NEW]: t("dashboard.opportunityProfile.status.new"),
    [OpportunityStatusType.ACTIVE]: t("dashboard.opportunityProfile.status.active"),
    [OpportunityStatusType.PAST]: t("dashboard.opportunityProfile.status.past"),
  };

  const getStatusDescription = (status: OpportunityStatusType): string => {
    const key = STATUS_DESCRIPTION_KEYS[status];
    return t(`dashboard.opportunityProfile.statusDescriptions.${key}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeDialog}>
      <ModalContainer data-testid="change-opportunity-status-dialog">
        <ModalTitle>{t("dashboard.opportunityProfile.modalData.title")}</ModalTitle>

        <OptionsContainer>
          {Object.values(OpportunityStatusType).map((status) => (
            <OptionItem key={status}>
              <RadioOption>
                <input
                  type="radio"
                  name="opportunity-status"
                  checked={statusOpportunity === status}
                  onChange={() => setStatusOpportunity(status)}
                />
                <OptionLabel>{statusLabelMap[status]}</OptionLabel>
              </RadioOption>
              <OptionDescription>{getStatusDescription(status)}</OptionDescription>
            </OptionItem>
          ))}
        </OptionsContainer>

        <DialogButtonGroup>
          <CancelButton onClick={closeDialog}>{t("dashboard.opportunityProfile.modalData.cancel")}</CancelButton>
          <LargePrimaryButton onClick={saveDialog} disabled={isSaveDisabled} $disabled={isSaveDisabled}>
            {t("dashboard.opportunityProfile.modalData.save")}
          </LargePrimaryButton>
        </DialogButtonGroup>
      </ModalContainer>
    </Modal>
  );
};
