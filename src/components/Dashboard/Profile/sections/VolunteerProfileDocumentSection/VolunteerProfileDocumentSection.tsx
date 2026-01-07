"use client";
import { useVolunteerDocuments } from "@/hooks/useVolunteerDocuments";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { DocumentTableRow } from "./DocumentTableRow";
import { ACTION_COLUMN_WIDTH, Container, HeaderCell, Table, TableHeader } from "./styles";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { useDeleteDocument, useUploadDocument } from "./useDocumentOperations";
import { useDialogState } from "./useDialogState";
import { DocumentRow, enrichDocuments, extractDocumentUrl } from "./utils";

type Props = {
  volunteer: ApiVolunteerGet;
};

export function VolunteerProfileDocumentSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const {
    deleteDocument: deleteDialogDocument,
    uploadDocument: uploadDialogDocument,
    previewDocument,
    openDialog,
    closeDialog,
    isDeleteOpen,
    isUploadOpen,
    isPreviewOpen,
  } = useDialogState();

  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  const { data: fetchedDocuments, isLoading, isError } = useVolunteerDocuments(volunteer.id);

  const documentRows = useMemo(
    () => (fetchedDocuments ? enrichDocuments(fetchedDocuments) : []),
    [fetchedDocuments]
  );

  const uploadMutation = useUploadDocument(volunteer.id, () => closeDialog("upload"));
  const deleteMutation = useDeleteDocument(volunteer.id, () => {
    closeDialog("delete");
    closeDialog("preview");
  });

  const handleConfirmDelete = () => {
    if (deleteDialogDocument) {
      deleteMutation.mutate({
        volunteerId: volunteer.id,
        documentType: deleteDialogDocument.type,
      });
    }
  };

  const handleConfirmUpload = (file: File) => {
    if (uploadDialogDocument) {
      uploadMutation.mutate({
        volunteerId: volunteer.id,
        file,
        documentType: uploadDialogDocument.type,
      });
    }
  };

  const handleDownload = (row: DocumentRow) => {
    if (!row.document?.url) return;

    const link = document.createElement("a");
    link.href = row.document.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (row: DocumentRow) => {
    if (!row.document?.url) {
      toast.error(t("message.previewError"));
      return;
    }

    const actualUrl = extractDocumentUrl(row.document.url);
    if (!actualUrl) {
      toast.error(t("message.previewError"));
      return;
    }

    setDocumentUrl(actualUrl);
    openDialog("preview", row);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading documents.</div>;
  }

  return (
    <>
      <Container data-testid="volunteer-profile-document-section-container">
        <Table>
          <TableHeader>
            <HeaderCell>{t("dashboard.documentSection.typeOfDocument")}</HeaderCell>
            <HeaderCell $width="180px">{t("dashboard.documentSection.status")}</HeaderCell>
            <HeaderCell $width="152px" $noWrap>
              {t("dashboard.documentSection.uploadedOn")}
            </HeaderCell>
            <HeaderCell $width={ACTION_COLUMN_WIDTH}></HeaderCell>
            <HeaderCell $width={ACTION_COLUMN_WIDTH}></HeaderCell>
            <HeaderCell $width={ACTION_COLUMN_WIDTH}></HeaderCell>
            <HeaderCell $width={ACTION_COLUMN_WIDTH}></HeaderCell>
          </TableHeader>

          {documentRows.map((row, index) => (
            <DocumentTableRow
              key={row.type}
              documentRow={row}
              isLast={index === documentRows.length - 1}
              onUpload={() => openDialog("upload", row)}
              onPreview={() => handlePreview(row)}
              onDownload={() => handleDownload(row)}
              onDelete={() => openDialog("delete", row)}
            />
          ))}
        </Table>
      </Container>

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        documentName={
          deleteDialogDocument?.nameKey
            ? t(`dashboard.documentSection.documentNames.${deleteDialogDocument.nameKey}`)
            : ""
        }
        onCancel={() => closeDialog("delete")}
        onConfirm={handleConfirmDelete}
      />

      <UploadDocumentDialog
        isOpen={isUploadOpen}
        documentName={
          uploadDialogDocument?.nameKey
            ? t(`dashboard.documentSection.documentNames.${uploadDialogDocument.nameKey}`)
            : ""
        }
        onCancel={() => closeDialog("upload")}
        onUpload={handleConfirmUpload}
        isUploading={uploadMutation.isPending}
      />

      <DocumentPreviewDialog
        isOpen={isPreviewOpen}
        documentName={
          previewDocument?.nameKey ? t(`dashboard.documentSection.documentNames.${previewDocument.nameKey}`) : ""
        }
        documentUrl={documentUrl}
        onClose={() => closeDialog("preview")}
        onDownload={() => previewDocument && handleDownload(previewDocument)}
        onDelete={() => previewDocument && openDialog("delete", previewDocument)}
      />
    </>
  );
}
