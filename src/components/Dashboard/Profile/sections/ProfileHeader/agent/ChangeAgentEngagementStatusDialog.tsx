"use client";
import { Modal } from "@/components/core/modal/Modal";
import { useTranslation } from "react-i18next";
import {
  DialogButtonGroup,
  LargePrimaryButton,
  PrimaryCancelButton,
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
import { AGENT_DIALOG_STATUSES, AGENT_ENGAGEMENT_DESCRIPTION_KEYS, createEngagementStatusLabelMap } from "./constants";
import { UseAgentEngagementStatusDialogReturn } from "./useAgentEngagementStatusDialog";

type Props = {
  dialog: UseAgentEngagementStatusDialogReturn;
};

export const ChangeAgentEngagementStatusDialog = ({
  dialog: { isOpen, closeDialog, statusEngagement, setStatusEngagement, saveDialog, isSaveDisabled },
}: Props) => {
  const { t } = useTranslation();
  const engagementStatusLabels = createEngagementStatusLabelMap(t);

  return (
    <Modal isOpen={isOpen} onClose={closeDialog}>
      <ModalContainer data-testid="change-agent-engagement-status-dialog">
        <ModalTitle>{t("dashboard.agentProfile.modalData.title")}</ModalTitle>

        <OptionsContainer>
          {AGENT_DIALOG_STATUSES.map((status) => (
            <OptionItem key={status}>
              <RadioOption>
                <input
                  type="radio"
                  name="agent-engagement-status"
                  checked={statusEngagement === status}
                  onChange={() => setStatusEngagement(status)}
                />
                <OptionLabel>{engagementStatusLabels[status]}</OptionLabel>
              </RadioOption>
              <OptionDescription>
                {t(`dashboard.agentProfile.modalData.options.${AGENT_ENGAGEMENT_DESCRIPTION_KEYS[status]}`)}
              </OptionDescription>
            </OptionItem>
          ))}
        </OptionsContainer>

        <DialogButtonGroup>
          <PrimaryCancelButton onClick={closeDialog}>{t("dashboard.agentProfile.modalData.cancel")}</PrimaryCancelButton>
          <LargePrimaryButton onClick={saveDialog} disabled={isSaveDisabled} $disabled={isSaveDisabled}>
            {t("dashboard.agentProfile.modalData.save")}
          </LargePrimaryButton>
        </DialogButtonGroup>
      </ModalContainer>
    </Modal>
  );
};
