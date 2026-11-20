"use client";

import { FormInput } from "@/components/core/common";
import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { useAccountPerson, useRenameAccount } from "@/hooks/useAdminAccounts";
import { ApiPersonGet } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  personId: number;
  email: string;
  onClose: () => void;
};

export function EditNameDialog(props: Props) {
  const { person, isError } = useAccountPerson(props.personId);
  return <EditNameForm key={person ? "loaded" : "loading"} {...props} person={person} isError={isError} />;
}

type FormProps = Props & { person?: ApiPersonGet; isError: boolean };

function EditNameForm({ personId, email, onClose, person, isError }: FormProps) {
  const { t } = useTranslation();
  const { renameAccount, isRenaming } = useRenameAccount();
  const [firstName, setFirstName] = useState(person?.firstName ?? "");
  const [lastName, setLastName] = useState(person?.lastName ?? "");

  const changes = {
    ...(firstName.trim() !== (person?.firstName ?? "") ? { firstName: firstName.trim() } : {}),
    ...(lastName.trim() !== (person?.lastName ?? "") ? { lastName: lastName.trim() } : {}),
  };
  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const hasChanges = Object.keys(changes).length > 0;

  const handleSave = () => renameAccount({ personId, name: changes }, { onSuccess: onClose });

  return (
    <ConfirmationDialog
      title={t("dashboard.admin.accounts.editTitle")}
      message={isError ? t("dashboard.admin.accounts.personLoadError") : email}
      confirmText={t("dashboard.admin.accounts.save")}
      onCancel={onClose}
      onConfirm={handleSave}
      cancelDisabled={isRenaming}
      confirmDisabled={!person || isError || isRenaming || !isValid || !hasChanges}
    >
      <Fields>
        <Label>
          {t("dashboard.admin.accounts.firstName")}
          <FormInput
            name="firstName"
            autoComplete="off"
            placeHolder=""
            value={firstName}
            onInputChange={setFirstName}
          />
        </Label>
        <Label>
          {t("dashboard.admin.accounts.lastName")}
          <FormInput name="lastName" autoComplete="off" placeHolder="" value={lastName} onInputChange={setLastName} />
        </Label>
      </Fields>
    </ConfirmationDialog>
  );
}

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  --form-input-container-height: var(--button-height);
  --form-input-container-border-radius: var(--button-border-radius);
  --form-input-container-padding: 0 var(--spacing-24);
  --form-input-container-border: 1px solid var(--color-grey-200);
  --form-input-container-border-focus: 2px solid var(--color-green-200);
  --form-input-fontSize: var(--text-p-font-size);
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  color: var(--color-midnight);
  font-size: var(--text-p-font-size);
  font-weight: var(--font-weight-semi-bold);
`;
