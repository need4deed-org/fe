import { Button } from "@/components/core/button";
import { FormInput } from "@/components/core/common";
import { ActionButtonWithTooltip } from "@/components/Dashboard/common/ActionButtonWithTooltip";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { ConfirmationDialog } from "@/components/Dashboard/Profile/sections/shared/ConfirmationDialog";
import { Paragraph } from "@/components/styled/text";
import { useTrustedDomains } from "@/hooks/useTrustedDomains";
import { TrashIcon } from "@phosphor-icons/react";
import { ApiTrustedDomain } from "need4deed-sdk";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { isValidDomain, normalizeDomain } from "./helpers";

export function TrustedDomainsTab() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [domainToRemove, setDomainToRemove] = useState<ApiTrustedDomain | null>(null);
  const { domains, isLoading, addDomain, isAdding, removeDomain, isRemoving } = useTrustedDomains(() =>
    setError(t("dashboard.admin.domains.duplicate")),
  );

  const handleInputChange = (value: string) => {
    setInput(value);
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const domain = normalizeDomain(input);
    if (!isValidDomain(domain)) {
      setError(t("dashboard.admin.domains.invalid"));
      return;
    }
    addDomain({ domain }, { onSuccess: () => setInput("") });
  };

  const handleConfirmRemove = () => {
    if (!domainToRemove) return;
    removeDomain(domainToRemove.id, { onSettled: () => setDomainToRemove(null) });
  };

  return (
    <Container>
      <Paragraph>{t("dashboard.admin.domains.helper")}</Paragraph>

      <AddForm onSubmit={handleSubmit} noValidate>
        <InputWrapper>
          <FormInput
            placeHolder={t("dashboard.admin.domains.placeholder")}
            value={input}
            onInputChange={handleInputChange}
            errors={error ? [error] : undefined}
          />
        </InputWrapper>
        <Button
          type="submit"
          text={t("dashboard.admin.domains.add")}
          disabled={isAdding || !input.trim()}
          width="auto"
        />
      </AddForm>

      {isLoading ? (
        <DashboardListLoading />
      ) : domains.length === 0 ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.domains.empty")}</Paragraph>
      ) : (
        <DomainList>
          {domains.map((trustedDomain) => (
            <DomainRow key={trustedDomain.id}>
              <Paragraph>{trustedDomain.domain}</Paragraph>
              <ActionButtonWithTooltip
                tooltipText={t("dashboard.admin.domains.remove")}
                ariaLabel={t("dashboard.admin.domains.removeAria", { domain: trustedDomain.domain })}
                onClick={() => setDomainToRemove(trustedDomain)}
              >
                <TrashIcon size={20} />
              </ActionButtonWithTooltip>
            </DomainRow>
          ))}
        </DomainList>
      )}

      {domainToRemove && (
        <ConfirmationDialog
          title={t("dashboard.admin.domains.removeTitle")}
          message={t("dashboard.admin.domains.removeMessage", { domain: domainToRemove.domain })}
          confirmText={t("dashboard.admin.domains.remove")}
          onCancel={() => setDomainToRemove(null)}
          onConfirm={handleConfirmRemove}
          cancelDisabled={isRemoving}
          confirmDisabled={isRemoving}
        />
      )}
    </Container>
  );
}

export default TrustedDomainsTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  max-width: 640px;
`;

const AddForm = styled.form`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-12);

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const DomainList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const DomainRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-12);
  padding: var(--spacing-12) 0;
  border-bottom: 1px solid var(--color-orchid-subtle);
`;
