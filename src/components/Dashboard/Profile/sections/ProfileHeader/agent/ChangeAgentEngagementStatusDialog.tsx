"use client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog } from "../common";
import { AGENT_DIALOG_STATUSES, AGENT_ENGAGEMENT_DESCRIPTION_KEYS, createEngagementStatusLabelMap } from "./constants";
import { UseAgentEngagementStatusDialogReturn } from "./useAgentEngagementStatusDialog";

type Props = {
  dialog: UseAgentEngagementStatusDialogReturn;
};

export const ChangeAgentEngagementStatusDialog = ({
  dialog: { isOpen, closeDialog, statusEngagement, setStatusEngagement, saveDialog, isSaveDisabled },
}: Props) => {
  const { t } = useTranslation();
  const engagementStatusLabels = useMemo(() => createEngagementStatusLabelMap(t), [t]);

  const options = AGENT_DIALOG_STATUSES.map((status) => ({
    value: status,
    label: engagementStatusLabels[status],
    description: t(`dashboard.agentProfile.modalData.options.${AGENT_ENGAGEMENT_DESCRIPTION_KEYS[status]}`),
  }));

  return (
    <ChangeStatusDialog
      testId="change-agent-engagement-status-dialog"
      isOpen={isOpen}
      title={t("dashboard.agentProfile.modalData.title")}
      options={options}
      selected={statusEngagement}
      onSelect={setStatusEngagement}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="agent-engagement-status"
      saveLabel={t("dashboard.agentProfile.modalData.save")}
      cancelLabel={t("dashboard.agentProfile.modalData.cancel")}
    />
  );
};
