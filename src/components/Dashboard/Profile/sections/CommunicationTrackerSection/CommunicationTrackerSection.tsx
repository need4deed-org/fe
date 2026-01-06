"use client";
import { Heading2 } from "@/components/styled/text";
import { ChatTeardropDots, PencilSimple, Trash } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CommunicationDialog, CommunicationEntry } from "./CommunicationDialog";
import {
  ActionButton,
  ActionCell,
  AddButton,
  Container,
  DeleteCancelButton,
  DeleteConfirmButton,
  DeleteConfirmButtons,
  DeleteConfirmDialog,
  DeleteConfirmOverlay,
  DeleteConfirmText,
  DeleteConfirmTitle,
  EmptyState,
  Header,
  IconContainer,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TitleRow,
} from "./styles";

type Props = {
  volunteer: ApiVolunteerGet;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CommunicationTrackerSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communications, setCommunications] = useState<CommunicationEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<CommunicationEntry | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<CommunicationEntry | null>(null);

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (entry: CommunicationEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (entry: CommunicationEntry) => {
    setDeleteConfirmId(entry.id!);
    setDeleteConfirmEntry(entry);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      setCommunications(communications.filter((c) => c.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      setDeleteConfirmEntry(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
    setDeleteConfirmEntry(null);
  };

  const handleSave = (entry: CommunicationEntry) => {
    if (entry.id) {
      setCommunications(communications.map((c) => (c.id === entry.id ? entry : c)));
    } else {
      setCommunications([...communications, { ...entry, id: Date.now() }]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getTypeLabel = (type: string, notes?: string) => {
    if (type === "other" && notes) {
      // For "other" type, return the communication type from notes
      switch (notes) {
        case "briefedVolunteer":
          return t("dashboard.volunteerProfile.communicationSection.communicationTypes.briefedVolunteer", "Briefed (accompanying volunteer)");
        case "firstInquiry":
          return t("dashboard.volunteerProfile.communicationSection.communicationTypes.firstInquiry", "First inquiry sent");
        case "opportunityList":
          return t("dashboard.volunteerProfile.communicationSection.communicationTypes.opportunityList", "Opportunity list sent");
        case "statusUpdate":
          return t("dashboard.volunteerProfile.communicationSection.communicationTypes.statusUpdate", "Status update");
        case "postMatchFollowUp":
          return t("dashboard.volunteerProfile.communicationSection.communicationTypes.postMatchFollowUp", "Post-match follow-up");
        default:
          return notes;
      }
    }
    switch (type) {
      case "called":
        return t("dashboard.volunteerProfile.communicationSection.contactTypes.called", "Called");
      case "triedToCall":
        return t("dashboard.volunteerProfile.communicationSection.contactTypes.triedToCall", "Tried to call");
      case "textedOrEmailed":
        return t("dashboard.volunteerProfile.communicationSection.contactTypes.textedOrEmailed", "Texted or emailed");
      case "other":
        return t("dashboard.volunteerProfile.communicationSection.contactTypes.other", "Other");
      default:
        return type;
    }
  };

  const getContactMethodLabel = (method: string) => {
    switch (method) {
      case "phoneNumber":
        return t("dashboard.volunteerProfile.communicationSection.platformOptions.phoneNumber", "Phone number");
      case "telegram":
        return t("dashboard.volunteerProfile.communicationSection.platformOptions.telegram", "Telegram");
      case "whatsapp":
        return t("dashboard.volunteerProfile.communicationSection.platformOptions.whatsapp", "Whatsapp");
      case "signal":
        return t("dashboard.volunteerProfile.communicationSection.platformOptions.signal", "Signal");
      case "email":
        return t("dashboard.volunteerProfile.communicationSection.platformOptions.email", "E-mail");
      case "sms":
        return t("dashboard.volunteerProfile.communicationSection.platformOptions.sms", "SMS");
      case "voicenote":
        return t("dashboard.volunteerProfile.communicationSection.platformOptions.voicenote", "Voicenote");
      default:
        return method;
    }
  };

  return (
    <Container data-testid="communication-tracker-section-container">
      <Header>
        <TitleRow>
          <IconContainer>
            <ChatTeardropDots size={40} weight="fill" />
          </IconContainer>
          <Heading2>{t("dashboard.volunteerProfile.communicationSection.title", "Communication Tracker")}</Heading2>
        </TitleRow>
        <AddButton onClick={handleAddNew} data-testid="add-communication-button">
          {t("dashboard.volunteerProfile.communicationSection.addNew", "+ Register contact")}
        </AddButton>
      </Header>

      {communications.length === 0 ? (
        <EmptyState data-testid="empty-state">
          {t("dashboard.volunteerProfile.communicationSection.emptyState", "No communications recorded yet")}
        </EmptyState>
      ) : (
        <TableContainer data-testid="communications-table">
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>{t("dashboard.volunteerProfile.communicationSection.date", "Date")}</TableHeaderCell>
                <TableHeaderCell>{t("dashboard.volunteerProfile.communicationSection.type", "Type")}</TableHeaderCell>
                <TableHeaderCell>
                  {t("dashboard.volunteerProfile.communicationSection.contactMethod", "Contact method")}
                </TableHeaderCell>
                <TableHeaderCell>{t("dashboard.volunteerProfile.communicationSection.actions", "Actions")}</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {communications.map((entry) => (
                <TableRow key={entry.id} data-testid={`communication-row-${entry.id}`}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>
                    <StatusBadge $type="first-time">{getTypeLabel(entry.type, entry.notes)}</StatusBadge>
                  </TableCell>
                  <TableCell>{getContactMethodLabel(entry.contactMethod)}</TableCell>
                  <ActionCell>
                    <ActionButton onClick={() => handleEdit(entry)} data-testid={`edit-button-${entry.id}`}>
                      <PencilSimple size={20} weight="regular" />
                    </ActionButton>
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

      <DeleteConfirmOverlay $isOpen={deleteConfirmId !== null} onClick={cancelDelete} data-testid="delete-confirm-overlay">
        <DeleteConfirmDialog onClick={(e) => e.stopPropagation()} data-testid="delete-confirm-dialog">
          <DeleteConfirmTitle>
            {t("dashboard.volunteerProfile.communicationSection.deleteConfirmTitle", "Delete entry?")}
          </DeleteConfirmTitle>
          <DeleteConfirmText>
            {deleteConfirmEntry &&
              t("dashboard.volunteerProfile.communicationSection.deleteConfirmText", {
                entryType: getTypeLabel(deleteConfirmEntry.type, deleteConfirmEntry.notes),
                defaultValue: `"${getTypeLabel(deleteConfirmEntry.type, deleteConfirmEntry.notes)}" communication entry will be permanently deleted.`,
              })}
          </DeleteConfirmText>
          <DeleteConfirmButtons>
            <DeleteCancelButton onClick={cancelDelete} data-testid="delete-cancel-button">
              {t("dashboard.volunteerProfile.communicationSection.cancel", "Cancel")}
            </DeleteCancelButton>
            <DeleteConfirmButton onClick={confirmDelete} data-testid="delete-confirm-button">
              {t("dashboard.volunteerProfile.communicationSection.delete", "Delete")}
            </DeleteConfirmButton>
          </DeleteConfirmButtons>
        </DeleteConfirmDialog>
      </DeleteConfirmOverlay>
    </Container>
  );
}
