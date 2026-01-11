"use client";
import { useCommunications } from "@/hooks/useCommunications";
import { useCreateCommunication } from "@/hooks/useCreateCommunication";
import { useDeleteCommunication } from "@/hooks/useDeleteCommunication";
import { useUpdateCommunication } from "@/hooks/useUpdateCommunication";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { ApiVolunteerGet, ContactType, ContactMethodType, CommunicationType } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CommunicationDialog, CommunicationEntry } from "./CommunicationDialog";
import {
  ACTION_COLUMN_WIDTH,
  ActionButton,
  ActionCell,
  AddButton,
  DeleteCancelButton,
  DeleteConfirmButton,
  DeleteConfirmButtons,
  DeleteConfirmDialog,
  DeleteConfirmOverlay,
  DeleteConfirmText,
  DeleteConfirmTitle,
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

type Props = {
  volunteer: ApiVolunteerGet;
};

export function CommunicationTrackerSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CommunicationEntry | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<CommunicationEntry | null>(null);

  const { data: apiCommunications } = useCommunications(volunteer.id);
  const { mutate: createCommunication } = useCreateCommunication(volunteer.id);
  const { mutate: updateCommunication } = useUpdateCommunication(
    volunteer.id,
    editingEntry?.id ?? 0,
  );
  const { mutate: deleteCommunication } = useDeleteCommunication(volunteer.id, deleteConfirmId ?? 0);

  const mapApiToCommunicationEntry = (apiData: typeof apiCommunications): CommunicationEntry[] => {
    if (!apiData) return [];

    return apiData.map((comm) => {
      const contactTypeMap: Record<ContactType, string> = {
        [ContactType.CALL]: "called",
        [ContactType.TRIED_CALL]: "triedToCall",
        [ContactType.TEXT_EMAIL]: "textedOrEmailed",
        [ContactType.OTHER]: "other",
      };

      const contactMethodMap: Record<ContactMethodType, string> = {
        [ContactMethodType.PHONE]: "phoneNumber",
        [ContactMethodType.TELEGRAM]: "telegram",
        [ContactMethodType.WHATSAPP]: "whatsapp",
        [ContactMethodType.SIGNAL]: "signal",
        [ContactMethodType.EMAIL]: "email",
        [ContactMethodType.SMS]: "sms",
        [ContactMethodType.VOICENOTE]: "voicenote",
      };

      const communicationTypeMap: Record<CommunicationType, string> = {
        [CommunicationType.BRIEF]: "briefedVolunteer",
        [CommunicationType.FIRST_INQUIRY]: "firstInquiry",
        [CommunicationType.OPPORTUNITY_LIST]: "opportunityList",
        [CommunicationType.STATUS_UPDATE]: "statusUpdate",
        [CommunicationType.POST_FOLLOWUP]: "postMatchFollowUp",
      };

      return {
        id: comm.id,
        date: comm.date,
        type: contactTypeMap[comm.contactType] || comm.contactType,
        contactMethod: contactMethodMap[comm.contactMethod] || comm.contactMethod,
        notes: comm.communicationType ? communicationTypeMap[comm.communicationType] : "",
      };
    });
  };

  const communications = mapApiToCommunicationEntry(apiCommunications).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

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
      deleteCommunication(undefined, {
        onSuccess: () => {
          setDeleteConfirmId(null);
          setDeleteConfirmEntry(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
    setDeleteConfirmEntry(null);
  };

  const handleSave = (entry: CommunicationEntry) => {
    const mapContactType = (type: string): ContactType => {
      const mapping: Record<string, ContactType> = {
        called: ContactType.CALL,
        triedToCall: ContactType.TRIED_CALL,
        textedOrEmailed: ContactType.TEXT_EMAIL,
        other: ContactType.OTHER,
      };
      return mapping[type] || ContactType.OTHER;
    };

    const mapContactMethod = (method: string): ContactMethodType => {
      const mapping: Record<string, ContactMethodType> = {
        phoneNumber: ContactMethodType.PHONE,
        telegram: ContactMethodType.TELEGRAM,
        whatsapp: ContactMethodType.WHATSAPP,
        signal: ContactMethodType.SIGNAL,
        email: ContactMethodType.EMAIL,
        sms: ContactMethodType.SMS,
        voicenote: ContactMethodType.VOICENOTE,
      };
      return mapping[method] || ContactMethodType.EMAIL;
    };

    const mapCommunicationType = (notes: string): CommunicationType | undefined => {
      const mapping: Record<string, CommunicationType> = {
        briefedVolunteer: CommunicationType.BRIEF,
        firstInquiry: CommunicationType.FIRST_INQUIRY,
        opportunityList: CommunicationType.OPPORTUNITY_LIST,
        statusUpdate: CommunicationType.STATUS_UPDATE,
        postMatchFollowUp: CommunicationType.POST_FOLLOWUP,
      };
      return mapping[notes];
    };

    if (entry.id) {
      updateCommunication(
        {
          contactType: mapContactType(entry.type),
          contactMethod: mapContactMethod(entry.contactMethod),
          communicationType: entry.type === "other" ? mapCommunicationType(entry.notes) : undefined,
          date: new Date(entry.date),
        },
        {
          onSuccess: () => setIsDialogOpen(false),
        },
      );
    } else {
      createCommunication(
        {
          contactType: mapContactType(entry.type),
          contactMethod: mapContactMethod(entry.contactMethod),
          communicationType: entry.type === "other" ? mapCommunicationType(entry.notes) : undefined,
          date: new Date(entry.date),
        },
        {
          onSuccess: () => setIsDialogOpen(false),
        },
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("de-DE", {
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
          return t("dashboard.communicationSection.communicationTypes.briefedVolunteer", "Briefed (accompanying volunteer)");
        case "firstInquiry":
          return t("dashboard.communicationSection.communicationTypes.firstInquiry", "First inquiry sent");
        case "opportunityList":
          return t("dashboard.communicationSection.communicationTypes.opportunityList", "Opportunity list sent");
        case "statusUpdate":
          return t("dashboard.communicationSection.communicationTypes.statusUpdate", "Status update");
        case "postMatchFollowUp":
          return t("dashboard.communicationSection.communicationTypes.postMatchFollowUp", "Post-match follow-up");
        default:
          return notes;
      }
    }
    switch (type) {
      case "called":
        return t("dashboard.communicationSection.contactTypes.called", "Called");
      case "triedToCall":
        return t("dashboard.communicationSection.contactTypes.triedToCall", "Tried to call");
      case "textedOrEmailed":
        return t("dashboard.communicationSection.contactTypes.textedOrEmailed", "Texted or emailed");
      case "other":
        return t("dashboard.communicationSection.contactTypes.other", "Other");
      default:
        return type;
    }
  };

  const getContactMethodLabel = (method: string) => {
    switch (method) {
      case "phoneNumber":
        return t("dashboard.communicationSection.platformOptions.phoneNumber", "Phone number");
      case "telegram":
        return t("dashboard.communicationSection.platformOptions.telegram", "Telegram");
      case "whatsapp":
        return t("dashboard.communicationSection.platformOptions.whatsapp", "Whatsapp");
      case "signal":
        return t("dashboard.communicationSection.platformOptions.signal", "Signal");
      case "email":
        return t("dashboard.communicationSection.platformOptions.email", "E-mail");
      case "sms":
        return t("dashboard.communicationSection.platformOptions.sms", "SMS");
      case "voicenote":
        return t("dashboard.communicationSection.platformOptions.voicenote", "Voicenote");
      default:
        return method;
    }
  };

  return (
    <Wrapper data-testid="communication-tracker-section-container">
      <Header>
        <AddButton onClick={handleAddNew} data-testid="add-communication-button">
          {t("dashboard.communicationSection.addNew", "+ Register contact")}
        </AddButton>
      </Header>

      {communications.length === 0 ? (
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
              <TableHeaderCell $width={ACTION_COLUMN_WIDTH}></TableHeaderCell>
              <TableHeaderCell $width={ACTION_COLUMN_WIDTH}></TableHeaderCell>
            </TableHeader>
            <TableBody>
              {communications.map((entry, index) => (
                <TableRow key={entry.id} $isLast={index === communications.length - 1} data-testid={`communication-row-${entry.id}`}>
                  <TableCell>
                    <StatusBadge $type="first-time">{getTypeLabel(entry.type, entry.notes)}</StatusBadge>
                  </TableCell>
                  <TableCell $maxWidth="310px">{getContactMethodLabel(entry.contactMethod)}</TableCell>
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

      <DeleteConfirmOverlay $isOpen={deleteConfirmId !== null} onClick={cancelDelete} data-testid="delete-confirm-overlay">
        <DeleteConfirmDialog onClick={(e) => e.stopPropagation()} data-testid="delete-confirm-dialog">
          <DeleteConfirmTitle>
            {t("dashboard.communicationSection.deleteConfirmTitle", "Delete entry?")}
          </DeleteConfirmTitle>
          <DeleteConfirmText>
            {deleteConfirmEntry &&
              t("dashboard.communicationSection.deleteConfirmText", {
                entryType: getTypeLabel(deleteConfirmEntry.type, deleteConfirmEntry.notes),
                defaultValue: `"${getTypeLabel(deleteConfirmEntry.type, deleteConfirmEntry.notes)}" communication entry will be permanently deleted.`,
              })}
          </DeleteConfirmText>
          <DeleteConfirmButtons>
            <DeleteCancelButton onClick={cancelDelete} data-testid="delete-cancel-button">
              {t("dashboard.communicationSection.cancel", "Cancel")}
            </DeleteCancelButton>
            <DeleteConfirmButton onClick={confirmDelete} data-testid="delete-confirm-button">
              {t("dashboard.communicationSection.delete", "Delete")}
            </DeleteConfirmButton>
          </DeleteConfirmButtons>
        </DeleteConfirmDialog>
      </DeleteConfirmOverlay>
    </Wrapper>
  );
}
