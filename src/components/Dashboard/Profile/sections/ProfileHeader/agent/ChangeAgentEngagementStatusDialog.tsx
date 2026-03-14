"use client";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog } from "../common";
import { createAgentDialogOptions } from "./constants";
import { UseAgentEngagementStatusDialogReturn } from "./useAgentEngagementStatusDialog";

type Props = {
  dialog: UseAgentEngagementStatusDialogReturn;
};

export const ChangeAgentEngagementStatusDialog = ({
  dialog: { isOpen, closeDialog, selected, setSelected, saveDialog, isSaveDisabled },
}: Props) => {
  const { t } = useTranslation();
  const options = createAgentDialogOptions(t);

  return (
    <ChangeStatusDialog
      testId="change-agent-engagement-status-dialog"
      isOpen={isOpen}
      title={t("dashboard.agentProfile.modalData.title")}
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="agent-engagement-status"
      saveLabel={t("dashboard.agentProfile.modalData.save")}
      cancelLabel={t("dashboard.agentProfile.modalData.cancel")}
    />
  );
};
