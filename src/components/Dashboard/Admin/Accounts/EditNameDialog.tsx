"use client";

import { FormInput } from "@/components/core/common";
import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { useAccountPerson, useRenameAccount } from "@/hooks/useAdminAccounts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  personId: number;
  email: string;
  onClose: () => void;
};

export function EditNameDialog({ personId, email, onClose }: Props) {
  const { t } = useTranslation();
  const { person, isLoading, isError } = useAccountPerson(personId);
  const { renameAccount, isRenaming } = useRenameAccount();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    if (!person || isPrefilled) return;
    setFirstName(person.firstName ?? "");
    setLastName(person.lastName ?? "");
    setIsPrefilled(true);
  }, [person, isPrefilled]);

  const isValid = firstName.trim().length > 0;

  const handleSave = () =>
    renameAccount(
      { personId, name: { firstName: firstName.trim(), lastName: lastName.trim() } },
      { onSuccess: onClose },
    );

  return (
    <ConfirmationDialog
      title={t("dashboard.admin.accounts.editTitle")}
      message={isError ? t("dashboard.admin.accounts.personLoadError") : email}
      confirmText={t("dashboard.admin.accounts.save")}
      onCancel={onClose}
      onConfirm={handleSave}
      cancelDisabled={isRenaming}
      confirmDisabled={isLoading || isError || !isPrefilled || isRenaming || !isValid}
    >
      <Fields>
        <Label>
          {t("dashboard.admin.accounts.firstName")}
          <FormInput name="firstName" autoComplete="off" value={firstName} onInputChange={setFirstName} />
        </Label>
        <Label>
          {t("dashboard.admin.accounts.lastName")}
          <FormInput name="lastName" autoComplete="off" value={lastName} onInputChange={setLastName} />
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
