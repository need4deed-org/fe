"use client";
import { Heading2 } from "@/components/styled/text";
import { ClipboardText, DownloadSimple, Eye, Trash, UploadSimple } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  ActionCell,
  Cell,
  Container,
  Header,
  HeaderCell,
  IconContainer,
  StatusBadge,
  Table,
  TableHeader,
  TableRow,
  TitleRow,
} from "./styles";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { Tooltip } from "./Tooltip";
import { Document } from "./types";

type Props = {
  volunteer: ApiVolunteerGet;
};

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    nameKey: "dashboard.volunteerProfile.documentSection.documentNames.measlesVaccination",
    status: "uploaded",
    uploadedOn: "21.03.2025",
  },
  {
    id: "2",
    nameKey: "dashboard.volunteerProfile.documentSection.documentNames.applicationCertificateGoodConduct",
    status: "uploaded",
    uploadedOn: "22.03.2025",
  },
  {
    id: "3",
    nameKey: "dashboard.volunteerProfile.documentSection.documentNames.certificateGoodConduct",
    status: "missing",
  },
  {
    id: "4",
    nameKey: "dashboard.volunteerProfile.documentSection.documentNames.passport",
    status: "missing",
  },
];

export function VolunteerProfileDocumentSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentToUpload, setDocumentToUpload] = useState<Document | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [documentToPreview, setDocumentToPreview] = useState<Document | null>(null);

  const handleUpload = (documentId: string) => {
    const doc = MOCK_DOCUMENTS.find((d) => d.id === documentId);
    if (doc) {
      setDocumentToUpload(doc);
      setUploadDialogOpen(true);
    }
  };

  const handleView = (documentId: string) => {
    const doc = MOCK_DOCUMENTS.find((d) => d.id === documentId);
    if (doc && doc.status === "uploaded") {
      setDocumentToPreview(doc);
      setPreviewDialogOpen(true);
    }
  };

  const handleDownload = (documentId: string) => {
    console.log("Download document:", documentId);
  };

  const handleDelete = (documentId: string) => {
    const doc = MOCK_DOCUMENTS.find((d) => d.id === documentId);
    if (doc) {
      setDocumentToDelete(doc);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      console.log("Delete confirmed:", documentToDelete.id);
      // TODO: Implement actual delete logic
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
      // Close preview dialog if it's open
      setPreviewDialogOpen(false);
      setDocumentToPreview(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleConfirmUpload = (file: File) => {
    if (documentToUpload) {
      console.log("Upload confirmed:", documentToUpload.id, file.name);
      // TODO: Implement actual upload logic
      setUploadDialogOpen(false);
      setDocumentToUpload(null);
    }
  };

  const handleCancelUpload = () => {
    setUploadDialogOpen(false);
    setDocumentToUpload(null);
  };

  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
    setDocumentToPreview(null);
  };

  const handleDownloadFromPreview = () => {
    if (documentToPreview) {
      console.log("Download from preview:", documentToPreview.id);
      // TODO: Implement actual download logic
    }
  };

  const handleDeleteFromPreview = () => {
    if (documentToPreview) {
      setDocumentToDelete(documentToPreview);
      setDeleteDialogOpen(true);
    }
  };

  return (
    <>
      <Container data-testid="volunteer-profile-document-section-container">
        <Header>
          <TitleRow>
            <IconContainer>
              <ClipboardText size={40} weight="fill" />
            </IconContainer>
            <Heading2>{t("dashboard.volunteerProfile.documentSection.title")}</Heading2>
          </TitleRow>
        </Header>

      <Table>
        <TableHeader>
          <HeaderCell>{t("dashboard.volunteerProfile.documentSection.typeOfDocument")}</HeaderCell>
          <HeaderCell $width="180px">{t("dashboard.volunteerProfile.documentSection.status")}</HeaderCell>
          <HeaderCell $width="152px" $noWrap>
            {t("dashboard.volunteerProfile.documentSection.uploadedOn")}
          </HeaderCell>
          <HeaderCell $width="56px"></HeaderCell>
          <HeaderCell $width="56px"></HeaderCell>
          <HeaderCell $width="56px"></HeaderCell>
          <HeaderCell $width="56px"></HeaderCell>
        </TableHeader>

        {MOCK_DOCUMENTS.map((doc, index) => (
          <TableRow key={doc.id} $isLast={index === MOCK_DOCUMENTS.length - 1}>
            <Cell>{t(doc.nameKey)}</Cell>
            <Cell $width="180px" $align="center">
              <StatusBadge $status={doc.status}>
                {doc.status === "uploaded"
                  ? t("dashboard.volunteerProfile.documentSection.uploaded")
                  : t("dashboard.volunteerProfile.documentSection.missing")}
              </StatusBadge>
            </Cell>
            <Cell $width="152px" $noWrap>
              {doc.uploadedOn || "–"}
            </Cell>
            <ActionCell $width="56px" $align="center">
              <Tooltip text={t("dashboard.volunteerProfile.documentSection.tooltips.upload")}>
                <ActionButton
                  onClick={() => handleUpload(doc.id)}
                  aria-label="Upload document"
                >
                  <UploadSimple size={24} weight="regular" />
                </ActionButton>
              </Tooltip>
            </ActionCell>
            <ActionCell $width="56px" $align="center">
              <Tooltip
                text={
                  doc.status === "missing"
                    ? t("dashboard.volunteerProfile.documentSection.tooltips.previewUnavailable")
                    : t("dashboard.volunteerProfile.documentSection.tooltips.preview")
                }
              >
                <ActionButton
                  onClick={() => handleView(doc.id)}
                  $disabled={doc.status === "missing"}
                  disabled={doc.status === "missing"}
                  aria-label="View document"
                >
                  <Eye size={24} weight="regular" />
                </ActionButton>
              </Tooltip>
            </ActionCell>
            <ActionCell $width="56px" $align="center">
              <Tooltip
                text={
                  doc.status === "missing"
                    ? t("dashboard.volunteerProfile.documentSection.tooltips.downloadUnavailable")
                    : t("dashboard.volunteerProfile.documentSection.tooltips.download")
                }
              >
                <ActionButton
                  onClick={() => handleDownload(doc.id)}
                  $disabled={doc.status === "missing"}
                  disabled={doc.status === "missing"}
                  aria-label="Download document"
                >
                  <DownloadSimple size={24} weight="regular" />
                </ActionButton>
              </Tooltip>
            </ActionCell>
            <ActionCell $width="56px" $align="center">
              <Tooltip
                text={
                  doc.status === "missing"
                    ? t("dashboard.volunteerProfile.documentSection.tooltips.deleteUnavailable")
                    : t("dashboard.volunteerProfile.documentSection.tooltips.delete")
                }
              >
                <ActionButton
                  onClick={() => handleDelete(doc.id)}
                  $disabled={doc.status === "missing"}
                  disabled={doc.status === "missing"}
                  aria-label="Delete document"
                >
                  <Trash size={24} weight="regular" />
                </ActionButton>
              </Tooltip>
            </ActionCell>
          </TableRow>
        ))}
      </Table>
      </Container>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        documentName={documentToDelete?.nameKey ? t(documentToDelete.nameKey) : ""}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <UploadDocumentDialog
        isOpen={uploadDialogOpen}
        documentName={documentToUpload?.nameKey ? t(documentToUpload.nameKey) : ""}
        onCancel={handleCancelUpload}
        onUpload={handleConfirmUpload}
      />

      <DocumentPreviewDialog
        isOpen={previewDialogOpen}
        documentName={documentToPreview?.nameKey ? t(documentToPreview.nameKey) : ""}
        documentUrl="/pdf-sample_0.pdf"
        onClose={handleClosePreview}
        onDownload={handleDownloadFromPreview}
        onDelete={handleDeleteFromPreview}
      />
    </>
  );
}
