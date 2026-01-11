"use client";
import { useCommunications } from "@/hooks/useCommunications";
import { useCreateCommunication } from "@/hooks/useCreateCommunication";
import { useDeleteCommunication } from "@/hooks/useDeleteCommunication";
import { useUpdateCommunication } from "@/hooks/useUpdateCommunication";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { ApiVolunteerGet, ApiCommunicationGet, ApiVolunteerCommunicationPost } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CommunicationDialog } from "./CommunicationDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import {
  ActionButton,
  ActionCell,
  AddButton,
  EmptyState,
  Header,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Wrapper,
} from "./styles";
import { formatDate, getDisplayLabel, getContactMethodLabel } from "./utils/translations";

type Props = {
  volunteer: ApiVolunteerGet;
};

export function CommunicationTrackerSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ApiCommunicationGet | undefined>(undefined);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<ApiCommunicationGet | null>(null);

  const { data: communications } = useCommunications(volunteer.id);
  const { mutate: createCommunication } = useCreateCommunication(volunteer.id);
  const { mutate: updateCommunication } = useUpdateCommunication(
    volunteer.id,
    editingEntry?.id ?? 0,
  );
  const { mutate: deleteCommunication } = useDeleteCommunication(volunteer.id, deleteConfirmEntry?.id ?? 0);

  const sortedCommunications = (communications || []).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (entry: ApiCommunicationGet) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (entry: ApiCommunicationGet) => {
    setDeleteConfirmEntry(entry);
  };

  const confirmDelete = () => {
    if (deleteConfirmEntry) {
      deleteCommunication(undefined, {
        onSuccess: () => {
          setDeleteConfirmEntry(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmEntry(null);
  };

  const handleSave = (data: Partial<ApiCommunicationGet>) => {
    const payload: ApiVolunteerCommunicationPost = {
      contactType: data.contactType!,
      contactMethod: data.contactMethod!,
      communicationType: data.communicationType!,
      date: data.date!,
    };

    if (data.id) {
      updateCommunication(payload, {
        onSuccess: () => setIsDialogOpen(false),
      });
    } else {
      createCommunication(payload, {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  return (
    <Wrapper data-testid="communication-tracker-section-container">
      <Header>
        <AddButton onClick={handleAddNew} data-testid="add-communication-button">
          {t("dashboard.communicationSection.addNew", "+ Register contact")}
        </AddButton>
      </Header>

      {sortedCommunications.length === 0 ? (
        <EmptyState data-testid="empty-state">
          {t("dashboard.communicationSection.emptyState", "No communications recorded yet")}
        </EmptyState>
      ) : (
        <TableContainer data-testid="communications-table">
          <Table>
            <TableHeader>
              <TableHeaderCell>{t("dashboard.communicationSection.typeOfContact")}</TableHeaderCell>
              <TableHeaderCell $maxWidth="310px">{t("dashboard.communicationSection.contactMethodLabel")}</TableHeaderCell>
              <TableHeaderCell $width="152px">{t("dashboard.communicationSection.date")}</TableHeaderCell>
              <TableHeaderCell $width="var(--communication-tracker-action-column-width)"></TableHeaderCell>
              <TableHeaderCell $width="var(--communication-tracker-action-column-width)"></TableHeaderCell>
            </TableHeader>
            <TableBody>
              {sortedCommunications.map((entry, index) => (
                <TableRow key={entry.id} $isLast={index === sortedCommunications.length - 1} data-testid={`communication-row-${entry.id}`}>
                  <TableCell>
                    <StatusBadge $type="first-time">
                      {getDisplayLabel(t, entry.contactType, entry.communicationType)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell $maxWidth="310px">{getContactMethodLabel(t, entry.contactMethod)}</TableCell>
                  <TableCell $width="152px" $noWrap>{formatDate(entry.date)}</TableCell>
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

      <CommunicationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={editingEntry}
      />

      <DeleteConfirmationDialog
        isOpen={deleteConfirmEntry !== null}
        communication={deleteConfirmEntry}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </Wrapper>
  );
}
