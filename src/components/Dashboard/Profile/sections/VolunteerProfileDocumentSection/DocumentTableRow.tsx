import { DownloadSimple, Eye, Trash, UploadSimple } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { ActionButtonWithTooltip } from "./ActionButtonWithTooltip";
import { ActionCell, Cell, StatusBadge, TableRow } from "./styles";
import { DocumentRow } from "./utils";

type Props = {
  documentRow: DocumentRow;
  isLast: boolean;
  onUpload: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
};

export function DocumentTableRow({
  documentRow,
  isLast,
  onUpload,
  onPreview,
  onDownload,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const { nameKey, isUploaded, document } = documentRow;

  return (
    <TableRow $isLast={isLast}>
      <Cell>{t(`dashboard.documentSection.documentNames.${nameKey}`)}</Cell>
      <Cell $width="180px" $align="center">
        <StatusBadge $status={isUploaded ? "uploaded" : "missing"}>
          {isUploaded
            ? t("dashboard.documentSection.uploaded")
            : t("dashboard.documentSection.missing")}
        </StatusBadge>
      </Cell>
      <Cell $width="152px" $noWrap>
        {document?.createdAt
          ? new Date(document.createdAt).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "–"}
      </Cell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            !isUploaded
              ? t("dashboard.documentSection.tooltips.upload")
              : t("dashboard.documentSection.tooltips.uploadUnavailable")
          }
          disabled={isUploaded}
          onClick={onUpload}
          ariaLabel="Upload document"
        >
          <UploadSimple size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            !isUploaded
              ? t("dashboard.documentSection.tooltips.previewUnavailable")
              : t("dashboard.documentSection.tooltips.preview")
          }
          disabled={!isUploaded}
          onClick={onPreview}
          ariaLabel="View document"
        >
          <Eye size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            !isUploaded
              ? t("dashboard.documentSection.tooltips.downloadUnavailable")
              : t("dashboard.documentSection.tooltips.download")
          }
          disabled={!isUploaded}
          onClick={onDownload}
          ariaLabel="Download document"
        >
          <DownloadSimple size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            !isUploaded
              ? t("dashboard.documentSection.tooltips.deleteUnavailable")
              : t("dashboard.documentSection.tooltips.delete")
          }
          disabled={!isUploaded}
          onClick={onDelete}
          ariaLabel="Delete document"
        >
          <Trash size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
    </TableRow>
  );
}
