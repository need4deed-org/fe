"use client";
import { Heading2 } from "@/components/styled/text";
import { ClipboardText, DownloadSimple, Eye, Trash, UploadSimple } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import {
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
import { ActionButtonWithTooltip } from "./ActionButtonWithTooltip";
import { useDialogState } from "./useDialogState";
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
  const {
    deleteDocument,
    uploadDocument,
    previewDocument,
    openDialog,
    closeDialog,
    isDeleteOpen,
    isUploadOpen,
    isPreviewOpen,
  } = useDialogState();

  const handleConfirmDelete = () => {
    if (deleteDocument) {
      console.log("Delete confirmed:", deleteDocument.id);
      // TODO: Implement actual delete logic
    }
    closeDialog("delete");
    closeDialog("preview");
  };

  const handleConfirmUpload = (file: File) => {
    if (uploadDocument) {
      console.log("Upload confirmed:", uploadDocument.id, file.name);
      // TODO: Implement actual upload logic
    }
    closeDialog("upload");
  };

  const handleDownload = (doc: Document) => {
    console.log("Download document:", doc.id);
    // TODO: Implement actual download logic
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

        {MOCK_DOCUMENTS.map((doc, index) => {
          const isMissing = doc.status === "missing";

          return (
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
                <ActionButtonWithTooltip
                  tooltipText={t("dashboard.volunteerProfile.documentSection.tooltips.upload")}
                  onClick={() => openDialog("upload", doc)}
                  ariaLabel="Upload document"
                >
                  <UploadSimple size={24} weight="regular" />
                </ActionButtonWithTooltip>
              </ActionCell>
              <ActionCell $width="56px" $align="center">
                <ActionButtonWithTooltip
                  tooltipText={
                    isMissing
                      ? t("dashboard.volunteerProfile.documentSection.tooltips.previewUnavailable")
                      : t("dashboard.volunteerProfile.documentSection.tooltips.preview")
                  }
                  disabled={isMissing}
                  onClick={() => openDialog("preview", doc)}
                  ariaLabel="View document"
                >
                  <Eye size={24} weight="regular" />
                </ActionButtonWithTooltip>
              </ActionCell>
              <ActionCell $width="56px" $align="center">
                <ActionButtonWithTooltip
                  tooltipText={
                    isMissing
                      ? t("dashboard.volunteerProfile.documentSection.tooltips.downloadUnavailable")
                      : t("dashboard.volunteerProfile.documentSection.tooltips.download")
                  }
                  disabled={isMissing}
                  onClick={() => handleDownload(doc)}
                  ariaLabel="Download document"
                >
                  <DownloadSimple size={24} weight="regular" />
                </ActionButtonWithTooltip>
              </ActionCell>
              <ActionCell $width="56px" $align="center">
                <ActionButtonWithTooltip
                  tooltipText={
                    isMissing
                      ? t("dashboard.volunteerProfile.documentSection.tooltips.deleteUnavailable")
                      : t("dashboard.volunteerProfile.documentSection.tooltips.delete")
                  }
                  disabled={isMissing}
                  onClick={() => openDialog("delete", doc)}
                  ariaLabel="Delete document"
                >
                  <Trash size={24} weight="regular" />
                </ActionButtonWithTooltip>
              </ActionCell>
            </TableRow>
          );
        })}
      </Table>
      </Container>

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        documentName={deleteDocument?.nameKey ? t(deleteDocument.nameKey) : ""}
        onCancel={() => closeDialog("delete")}
        onConfirm={handleConfirmDelete}
      />

      <UploadDocumentDialog
        isOpen={isUploadOpen}
        documentName={uploadDocument?.nameKey ? t(uploadDocument.nameKey) : ""}
        onCancel={() => closeDialog("upload")}
        onUpload={handleConfirmUpload}
      />

      <DocumentPreviewDialog
        isOpen={isPreviewOpen}
        documentName={previewDocument?.nameKey ? t(previewDocument.nameKey) : ""}
        documentUrl="/pdf-sample_0.pdf"
        onClose={() => closeDialog("preview")}
        onDownload={() => previewDocument && handleDownload(previewDocument)}
        onDelete={() => previewDocument && openDialog("delete", previewDocument)}
      />
    </>
  );
}
