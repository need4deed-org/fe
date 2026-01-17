"use client";
import { useAppreciationTracker } from "@/hooks/useAppreciationTracker";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { ApiVolunteerGet, VolunteerStateAppreciationType } from "need4deed-sdk";
import { ApiAppreciationGet, ApiAppreciationPost, ApiAppreciationPatch } from "./types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { AppreciationDialog } from "./AppreciationDialog";
import { ConfirmationDialog } from "../shared/ConfirmationDialog";
import {
  EmptyState,
  Header,
  StatusBadge,
  Wrapper,
} from "./styles";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  ActionCell,
  ActionButton,
} from "@/components/core/common/Table";
import { Button } from "@/components/core/button";

type Props = {
  volunteer: ApiVolunteerGet;
};

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "–";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd.MM.yyyy");
};

const getAppreciationTypeLabel = (t: (key: string) => string, type: VolunteerStateAppreciationType): string => {
  const typeLabels: Record<VolunteerStateAppreciationType, string> = {
    [VolunteerStateAppreciationType.T_SHIRT]: t("dashboard.appreciationSection.typeOptions.tshirt"),
    [VolunteerStateAppreciationType.TOTE_BAG]: t("dashboard.appreciationSection.typeOptions.toteBag"),
    [VolunteerStateAppreciationType.BENEFIT_CARD]: t("dashboard.appreciationSection.typeOptions.benefitCard"),
  };
  return typeLabels[type] || type;
};

export function AppreciationSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ApiAppreciationGet | undefined>(undefined);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<ApiAppreciationGet | null>(null);

  const {
    appreciations,
    createAppreciation,
    updateAppreciation,
    deleteAppreciation,
  } = useAppreciationTracker(volunteer.id);

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (entry: ApiAppreciationGet) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (entry: ApiAppreciationGet) => {
    setDeleteConfirmEntry(entry);
  };

  const confirmDelete = () => {
    if (deleteConfirmEntry) {
      deleteAppreciation(deleteConfirmEntry.id, {
        onSuccess: () => {
          setDeleteConfirmEntry(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmEntry(null);
  };

  const handleSave = (data: Partial<ApiAppreciationGet>) => {
    if (!data.title || !data.dateDue) {
      return;
    }

    if (data.id) {
      const payload: ApiAppreciationPatch = {
        title: data.title,
        dateDue: data.dateDue,
        dateDelivery: data.dateDelivery,
      };
      updateAppreciation({ id: data.id, data: payload }, {
        onSuccess: () => setIsDialogOpen(false),
      });
    } else {
      const payload: ApiAppreciationPost = {
        title: data.title,
        dateDue: data.dateDue,
        dateDelivery: data.dateDelivery,
      };
      createAppreciation(payload, {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  const getStatus = (entry: ApiAppreciationGet): "received" | "pending" => {
    return entry.dateDelivery ? "received" : "pending";
  };

  const getStatusLabel = (entry: ApiAppreciationGet): string => {
    if (entry.dateDelivery) {
      return t("dashboard.appreciationSection.statusReceived");
    }
    if (entry.dateDue) {
      return `${t("dashboard.appreciationSection.statusDueTo")} ${formatDate(entry.dateDue)}`;
    }
    return "–";
  };

  return (
    <Wrapper data-testid="appreciation-section-container">
      <Header>
        <Button
          onClick={handleAddNew}
          text={t("dashboard.appreciationSection.addNew")}
          backgroundcolor="var(--color-aubergine)"
          textColor="var(--color-white)"
          width="auto"
        />
      </Header>

      {appreciations.length === 0 ? (
        <EmptyState data-testid="empty-state">
          {t("dashboard.appreciationSection.emptyState")}
        </EmptyState>
      ) : (
        <TableContainer data-testid="appreciations-table">
          <Table>
            <TableHeader>
              <TableHeaderCell>{t("dashboard.appreciationSection.typeOfAppreciation")}</TableHeaderCell>
              <TableHeaderCell $width="227px">{t("dashboard.appreciationSection.status")}</TableHeaderCell>
              <TableHeaderCell $width="146px">{t("dashboard.appreciationSection.receivedOn")}</TableHeaderCell>
              <TableHeaderCell $width="var(--communication-tracker-action-column-width)"></TableHeaderCell>
              <TableHeaderCell $width="var(--communication-tracker-action-column-width)"></TableHeaderCell>
            </TableHeader>
            <TableBody>
              {appreciations.map((entry, index) => (
                <TableRow key={entry.id} $isLast={index === appreciations.length - 1} data-testid={`appreciation-row-${entry.id}`}>
                  <TableCell>
                    {getAppreciationTypeLabel(t, entry.title)}
                  </TableCell>
                  <TableCell $width="227px">
                    <StatusBadge $status={getStatus(entry)}>
                      {getStatusLabel(entry)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell $width="146px" $noWrap>
                    {entry.dateDelivery ? formatDate(entry.dateDelivery) : "–"}
                  </TableCell>
                  <ActionCell>
                    <ActionButton onClick={() => handleEdit(entry)} data-testid={`edit-button-${entry.id}`}>
                      <PencilSimple size={20} weight="regular" />
                    </ActionButton>
                  </ActionCell>
                  <ActionCell>
                    <ActionButton onClick={() => handleDelete(entry)} data-testid={`delete-button-${entry.id}`}>
                      <Trash size={20} weight="regular" />
                    </ActionButton>
                  </ActionCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AppreciationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={editingEntry}
      />

      {deleteConfirmEntry && (
        <ConfirmationDialog
          title={t("dashboard.appreciationSection.deleteConfirmTitle")}
          message={t("dashboard.appreciationSection.deleteConfirmText", {
            entryType: getAppreciationTypeLabel(t, deleteConfirmEntry.title),
          })}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </Wrapper>
  );
}
