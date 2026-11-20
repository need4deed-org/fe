"use client";

import { Search } from "@/components/core/common";
import { Select } from "@/components/core/common/select";
import {
  ActionCell,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@/components/core/common/Table";
import { ActionButtonWithTooltip } from "@/components/Dashboard/common/ActionButtonWithTooltip";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { Paragraph } from "@/components/styled/text";
import { useAdminAccounts } from "@/hooks/useAdminAccounts";
import { useAuth } from "@/hooks/useAuth";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { UserRole } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { EditNameDialog } from "./EditNameDialog";

const ROLE_OPTIONS = [
  { role: UserRole.COORDINATOR, labelKey: "dashboard.posts.roles.coordinator" },
  { role: UserRole.AGENT, labelKey: "dashboard.posts.roles.agent" },
  { role: UserRole.ADMIN, labelKey: "dashboard.posts.roles.admin" },
];

export function Accounts() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [role, setRole] = useState(UserRole.COORDINATOR);
  const [search, setSearch] = useState("");
  const [accountToEdit, setAccountToEdit] = useState<{ personId: number; email: string } | null>(null);
  const { accounts, isLoading, isError, isStale, isTruncated } = useAdminAccounts(role, search.trim());

  return (
    <Container>
      <Paragraph>{t("dashboard.admin.accounts.helper")}</Paragraph>

      <Filters>
        <Select
          aria-label={t("dashboard.admin.accounts.role")}
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
        >
          {ROLE_OPTIONS.map(({ role: value, labelKey }) => (
            <option key={value} value={value}>
              {t(labelKey)}
            </option>
          ))}
        </Select>
        <Search placeHolder={t("dashboard.admin.accounts.search")} value={search} onInputChange={setSearch} />
      </Filters>

      {isLoading ? (
        <DashboardListLoading />
      ) : isError ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.accounts.loadError")}</Paragraph>
      ) : accounts.length === 0 ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.accounts.empty")}</Paragraph>
      ) : (
        <TableContainer aria-busy={isStale} style={isStale ? { opacity: 0.5 } : undefined}>
          <Table>
            <TableHeader>
              <TableHeaderCell>{t("dashboard.admin.accounts.name")}</TableHeaderCell>
              <TableHeaderCell>{t("dashboard.admin.accounts.email")}</TableHeaderCell>
              <TableHeaderCell>{t("dashboard.admin.accounts.status")}</TableHeaderCell>
              <TableHeaderCell $width="64px" />
            </TableHeader>
            <TableBody>
              {accounts.map((account, index) => (
                <TableRow key={account.id} $isLast={index === accounts.length - 1}>
                  <TableCell>{account.fullName}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    {t(account.isActive ? "dashboard.admin.accounts.active" : "dashboard.admin.accounts.inactive")}
                  </TableCell>
                  <ActionCell $width="64px">
                    {isAdmin && !isStale && account.personId != null && (
                      <ActionButtonWithTooltip
                        tooltipText={t("dashboard.admin.accounts.edit")}
                        ariaLabel={t("dashboard.admin.accounts.editAria", { email: account.email })}
                        onClick={() => setAccountToEdit({ personId: account.personId!, email: account.email })}
                      >
                        <PencilSimpleIcon size={20} />
                      </ActionButtonWithTooltip>
                    )}
                  </ActionCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isTruncated && <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.accounts.truncated")}</Paragraph>}

      {accountToEdit && (
        <EditNameDialog
          personId={accountToEdit.personId}
          email={accountToEdit.email}
          onClose={() => setAccountToEdit(null)}
        />
      )}
    </Container>
  );
}

export default Accounts;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  max-width: 960px;
`;

const Filters = styled.div`
  display: flex;
  gap: var(--spacing-12);
  align-items: center;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
