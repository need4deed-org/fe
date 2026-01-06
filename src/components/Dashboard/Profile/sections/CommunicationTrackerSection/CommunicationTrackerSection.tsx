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

export function CommunicationTrackerSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communications, setCommunications] = useState<CommunicationEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<CommunicationEntry | undefined>(undefined);

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (entry: CommunicationEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCommunications(communications.filter((c) => c.id !== id));
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "called":
        return t("dashboard.volunteerProfile.communicationSection.contactTypes.called", "Called");
      case "triedToCall":
        return t("dashboard.volunteerProfile.communicationSection.contactTypes.triedToCall", "Tried to call");
      case "textedOrEmailed":
        return t("dashboard.volunteerProfile.communicationSection.contactTypes.textedOrEmailed", "Texted or emailed");
      case "other":
        return t("dashboard.volunteerProfile.communicationSection.contactTypes.other", "Other");
      case "status-change":
        return t("dashboard.volunteerProfile.communicationSection.statusChange", "Status change");
      case "follow-up":
        return t("dashboard.volunteerProfile.communicationSection.followUp", "Follow-up");
      case "inquiry":
        return t("dashboard.volunteerProfile.communicationSection.inquiry", "Inquiry");
      default:
        return type;
    }
  };

  const getContactMethodLabel = (method: string) => {
    switch (method) {
      case "email":
        return t("dashboard.volunteerProfile.communicationSection.email", "Email");
      case "phone":
        return t("dashboard.volunteerProfile.communicationSection.phone", "Phone");
      case "in-person":
        return t("dashboard.volunteerProfile.communicationSection.inPerson", "In person");
      case "message":
        return t("dashboard.volunteerProfile.communicationSection.message", "Message");
      default:
        return method;
    }
  };

  const getStatusType = (statusType?: string): string => {
    if (!statusType) return "inactive";
    const typeMap: Record<string, string> = {
      FIRST_TIME_VOLUNTEER: "first-time",
      ACTIVE_VOLUNTEER: "active",
      PAUSED_VOLUNTEER: "paused",
      INACTIVE_VOLUNTEER: "inactive",
    };
    return typeMap[statusType] || "inactive";
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
                <TableHeaderCell>{t("dashboard.volunteerProfile.communicationSection.notes", "Notes")}</TableHeaderCell>
                <TableHeaderCell>{t("dashboard.volunteerProfile.communicationSection.actions", "Actions")}</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {communications.map((entry) => (
                <TableRow key={entry.id} data-testid={`communication-row-${entry.id}`}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>
                    <StatusBadge $type={getStatusType(volunteer.statusType)}>{getTypeLabel(entry.type)}</StatusBadge>
                  </TableCell>
                  <TableCell>{getContactMethodLabel(entry.contactMethod)}</TableCell>
                  <TableCell>{entry.notes}</TableCell>
                  <ActionCell>
                    <ActionButton onClick={() => handleEdit(entry)} data-testid={`edit-button-${entry.id}`}>
                      <PencilSimple size={20} weight="regular" />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(entry.id!)} data-testid={`delete-button-${entry.id}`}>
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
    </Container>
  );
}
