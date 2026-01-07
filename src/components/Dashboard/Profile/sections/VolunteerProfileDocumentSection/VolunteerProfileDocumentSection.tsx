"use client";
import {
  DownloadSimple,
  Eye,
  Trash,
  UploadSimple,
} from "@phosphor-icons/react";
import { ApiVolunteerGet, DocumentType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import {
  ActionCell,
  Cell,
  Container,
  HeaderCell,
  StatusBadge,
  Table,
  TableHeader,
  TableRow,
} from "./styles";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { ActionButtonWithTooltip } from "./ActionButtonWithTooltip";
import { useDialogState } from "./useDialogState";
import { Document } from "./types";
import { useVolunteerDocuments } from "@/hooks/useVolunteerDocuments";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteDocument,
  getUploadMeta,
  uploadDocument as uploadDocumentApi,
} from "@/lib/api/volunteer";
import { toast } from "react-toastify";

type Props = {
  volunteer: ApiVolunteerGet;
};

const DOCUMENT_NAME_KEYS: Record<DocumentType, string> = {
  "measles-vacc-cert": "measlesVaccination",
  "CGC-application": "applicationCertificateGoodConduct",
  "good-conduct-cert": "certificateGoodConduct",
  "passport-copy": "passport",
};

export function VolunteerProfileDocumentSection({ volunteer }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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

  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  const {
    data: fetchedDocuments,
    isLoading,
    isError,
  } = useVolunteerDocuments(volunteer.id);

  useEffect(() => {
    if (fetchedDocuments) {
      const allDocumentTypes = Object.keys(
        DOCUMENT_NAME_KEYS
      ) as DocumentType[];
      const updatedDocuments = allDocumentTypes.map((type) => {
        const existingDoc = fetchedDocuments.find((doc) => doc.type === type);
        return {
          id: existingDoc?.id?.toString() || type,
          type: type,
          nameKey: DOCUMENT_NAME_KEYS[type],
          status: existingDoc ? "uploaded" : "missing",
          uploadedOn: existingDoc ? "–" : undefined, // Placeholder for date
          url: existingDoc?.url,
        };
      });
      setDocuments(updatedDocuments);
    }
  }, [fetchedDocuments]);

  const uploadMutation = useMutation({
    mutationFn: ({ file, document }: { file: File; document: Document }) => {
      return getUploadMeta(
        volunteer.id,
        file.type,
        file.name,
        document.type
      ).then((meta) => uploadDocumentApi(meta.url, meta.fields, file));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["volunteerDocuments", volunteer.id],
      });
      closeDialog("upload");
      toast.success(t("message.uploadSuccess"));
    },
    onError: (error: Error) => {
      console.error("Upload failed:", error);
      toast.error(t("message.uploadError"));
      closeDialog("upload");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (document: Document) =>
      deleteDocument(volunteer.id, document.type),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["volunteerDocuments", volunteer.id],
      });
      closeDialog("delete");
      toast.success(t("message.deleteSuccess"));
    },
    onError: (error: Error) => {
      console.error("Delete failed:", error);
      toast.error(t("message.deleteError"));
      closeDialog("delete");
    },
  });

  const handleConfirmDelete = () => {
    if (deleteDialogDocument) {
      deleteMutation.mutate(deleteDialogDocument);
    }
    closeDialog("delete");
    closeDialog("preview");
  };

  const handleConfirmUpload = (file: File) => {
    if (uploadDialogDocument) {
      uploadMutation.mutate({ file, document: uploadDialogDocument });
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.url) {
      window.open(doc.url, "_blank");
    }
  };

  const handlePreview = (doc: Document) => {
    setDocumentUrl(doc.url || null);
    openDialog("preview", doc);
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
            <HeaderCell>
              {t("dashboard.documentSection.typeOfDocument")}
            </HeaderCell>
            <HeaderCell $width="180px">
              {t("dashboard.documentSection.status")}
            </HeaderCell>
            <HeaderCell $width="152px" $noWrap>
              {t("dashboard.documentSection.uploadedOn")}
            </HeaderCell>
            <HeaderCell $width="56px"></HeaderCell>
            <HeaderCell $width="56px"></HeaderCell>
            <HeaderCell $width="56px"></HeaderCell>
            <HeaderCell $width="56px"></HeaderCell>
          </TableHeader>

          {documents.map((doc, index) => {
            const isMissing = doc.status === "missing";

            return (
              <TableRow key={doc.id} $isLast={index === documents.length - 1}>
                <Cell>
                  {t(
                    `dashboard.documentSection.documentNames.${doc.nameKey}`
                  )}
                </Cell>
                <Cell $width="180px" $align="center">
                  <StatusBadge $status={doc.status}>
                    {doc.status === "uploaded"
                      ? t("dashboard.documentSection.uploaded")
                      : t(
                          "dashboard.documentSection.missing"
                        )}
                  </StatusBadge>
                </Cell>
                <Cell $width="152px" $noWrap>
                  {doc.uploadedOn || "–"}
                </Cell>
                <ActionCell $width="56px" $align="center">
                  <ActionButtonWithTooltip
                    tooltipText={
                      isMissing
                        ? t(
                            "dashboard.documentSection.tooltips.upload"
                          )
                        : t(
                            "dashboard.documentSection.tooltips.reUpload"
                          )
                    }
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
                        ? t(
                            "dashboard.documentSection.tooltips.previewUnavailable"
                          )
                        : t(
                            "dashboard.documentSection.tooltips.preview"
                          )
                    }
                    disabled={isMissing}
                    onClick={() => handlePreview(doc)}
                    ariaLabel="View document"
                  >
                    <Eye size={24} weight="regular" />
                  </ActionButtonWithTooltip>
                </ActionCell>
                <ActionCell $width="56px" $align="center">
                  <ActionButtonWithTooltip
                    tooltipText={
                      isMissing
                        ? t(
                            "dashboard.documentSection.tooltips.downloadUnavailable"
                          )
                        : t(
                            "dashboard.documentSection.tooltips.download"
                          )
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
                        ? t(
                            "dashboard.documentSection.tooltips.deleteUnavailable"
                          )
                        : t(
                            "dashboard.documentSection.tooltips.delete"
                          )
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
          previewDocument?.nameKey
            ? t(`dashboard.documentSection.documentNames.${previewDocument.nameKey}`)
            : ""
        }
        documentUrl={documentUrl}
        onClose={() => closeDialog("preview")}
        onDownload={() => previewDocument && handleDownload(previewDocument)}
        onDelete={() =>
          previewDocument && openDialog("delete", previewDocument)
        }
      />
    </>
  );
}
