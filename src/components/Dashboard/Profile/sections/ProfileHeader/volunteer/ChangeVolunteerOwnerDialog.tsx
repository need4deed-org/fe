"use client";
import { SearchField, SearchInput } from "@/components/Dashboard/Posts/styles";
import { apiPathAgent } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { ApiAgentGetList } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog } from "../common";
import { NO_OWNER, UseVolunteerOwnerDialogReturn } from "./useVolunteerOwnerDialog";

const SEARCH_LIMIT = 20;
const i18nPrefix = "dashboard.volunteerProfile.volunteerHeader.ownerModal";

type Props = {
  dialog: UseVolunteerOwnerDialogReturn;
  currentOwner?: { id: number; title: string };
};

export const ChangeVolunteerOwnerDialog = ({ dialog, currentOwner }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { isOpen, closeDialog, selected, setSelected, saveDialog, isSaveDisabled } = dialog;

  const { data: agents = [] } = useGetQuery<ApiAgentGetList[]>({
    queryKey: ["agents", "owner-search", search],
    apiPath: `${apiPathAgent}/`,
    params: { limit: SEARCH_LIMIT, filter: { search } },
    enabled: isOpen && search.trim().length >= 2,
  });

  const found = agents.filter((agent) => agent.id !== currentOwner?.id);
  const options = [
    { value: NO_OWNER, label: t(`${i18nPrefix}.none`) },
    ...(currentOwner ? [{ value: currentOwner.id, label: currentOwner.title }] : []),
    ...found.map((agent) => ({ value: agent.id, label: agent.title })),
  ];

  const handleCancel = () => {
    setSearch("");
    closeDialog();
  };

  return (
    <ChangeStatusDialog
      testId="change-volunteer-owner-dialog"
      isOpen={isOpen}
      title={t(`${i18nPrefix}.title`)}
      beforeOptions={
        <SearchField>
          <SearchInput
            type="search"
            value={search}
            placeholder={t(`${i18nPrefix}.search`)}
            onChange={(event) => setSearch(event.target.value)}
          />
        </SearchField>
      }
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSave={saveDialog}
      onCancel={handleCancel}
      isSaveDisabled={isSaveDisabled}
      radioName="ownerAgentId"
      saveLabel={t(`${i18nPrefix}.save`)}
      cancelLabel={t(`${i18nPrefix}.cancel`)}
    />
  );
};
