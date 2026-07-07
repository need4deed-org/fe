"use client";
import { OpportunityType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog } from "../common";
import { createVolunteerTypeLabelMap } from "../common/labelMaps";
import { TYPE_DESCRIPTION_KEYS } from "./constants";
import { UseOpportunityTypeDialogReturn } from "./useOpportunityTypeDialog";

type Props = {
  dialog: UseOpportunityTypeDialogReturn;
};

export const ChangeOpportunityTypeDialog = ({
  dialog: { isOpen, closeDialog, selected, setSelected, saveDialog, isSaveDisabled },
}: Props) => {
  const { t } = useTranslation();
  const typeLabelMap = createVolunteerTypeLabelMap(t);

  const options = Object.values(OpportunityType).map((type) => ({
    value: type,
    label: typeLabelMap[type],
    description: t(`dashboard.opportunityProfile.typeModal.options.${TYPE_DESCRIPTION_KEYS[type]}`),
  }));

  return (
    <ChangeStatusDialog
      testId="change-opportunity-type-dialog"
      isOpen={isOpen}
      title={t("dashboard.opportunityProfile.typeModal.title")}
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="opportunity-type"
      saveLabel={t("dashboard.opportunityProfile.typeModal.save")}
      cancelLabel={t("dashboard.opportunityProfile.typeModal.cancel")}
    />
  );
};
