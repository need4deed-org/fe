import { useTranslation } from "react-i18next";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import styled from "styled-components";
import { UploadSimple, FilePlus } from "@phosphor-icons/react";
import { DialogOverlay } from "./shared/DialogOverlay";
import {
  DialogButtonGroup,
  PrimaryCancelButton,
  LargePrimaryButton,
} from "./shared/DialogButtonGroup";

type Props = {
  isOpen: boolean;
  documentName: string;
  onCancel: () => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
};

const Dialog = styled.div`
  background: var(--color-white);
  border-radius: var(--document-dialog-border-radius);
  padding: var(--document-dialog-padding);
  max-width: var(--document-dialog-max-width);
  width: var(--document-dialog-width);
  box-shadow: var(--document-dialog-shadow);
`;

const Title = styled.h2`
  font-weight: var(--document-upload-title-font-weight);
  font-size: var(--document-upload-title-font-size);
  line-height: var(--document-upload-title-line-height);
  color: var(--color-midnight);
  margin: 0 0 var(--document-upload-title-margin-bottom) 0;
`;

const Subtitle = styled.p`
  font-weight: var(--document-upload-subtitle-font-weight);
  font-size: var(--document-upload-subtitle-font-size);
  line-height: var(--document-upload-subtitle-line-height);
  color: var(--color-midnight);
  margin: 0 0 var(--document-upload-subtitle-margin-bottom) 0;
`;

const DropZone = styled.div<{ $isDragging: boolean; $hasFile: boolean }>`
  border: var(--document-upload-dropzone-border-width) dashed
    ${(props) =>
      props.$isDragging
        ? "var(--color-aubergine)"
        : "var(--document-upload-dropzone-border-color)"};
  border-radius: var(--document-upload-dropzone-border-radius);
  padding: var(--document-upload-dropzone-padding);
  text-align: center;
  background: ${(props) =>
    props.$isDragging
      ? "var(--color-aubergine-subtle)"
      : "var(--document-upload-dropzone-background)"};
  cursor: pointer;
  transition: var(--transition-all);
  margin-bottom: var(--document-upload-dropzone-margin-bottom);

  &:hover {
    border-color: var(--color-aubergine);
    background: var(--color-aubergine-subtle);
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--document-upload-dropzone-icon-margin-bottom);
  color: var(--color-aubergine);
`;

const DropZoneText = styled.p`
  font-weight: var(--document-upload-dropzone-text-font-weight);
  font-size: var(--document-upload-dropzone-text-font-size);
  line-height: var(--document-upload-dropzone-text-line-height);
  color: var(--color-midnight);
  margin: 0 0 var(--document-upload-dropzone-text-margin-bottom) 0;
`;

const DropZoneHint = styled.p`
  font-weight: var(--document-upload-dropzone-hint-font-weight);
  font-size: var(--document-upload-dropzone-hint-font-size);
  line-height: var(--document-upload-dropzone-hint-line-height);
  color: var(--document-upload-dropzone-hint-color);
  margin: 0;
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  gap: var(--document-upload-selected-file-gap);
  padding: var(--document-upload-selected-file-padding);
  background: var(--color-aubergine-subtle);
  border-radius: var(--document-upload-selected-file-border-radius);
  margin-bottom: var(--document-upload-selected-file-margin-bottom);
`;

const SelectedFileIcon = styled.div`
  color: var(--color-aubergine);
  display: flex;
  align-items: center;
`;

const SelectedFileText = styled.div`
  flex: 1;
`;

const SelectedFileLabel = styled.p`
  font-weight: var(--document-upload-selected-file-label-font-weight);
  font-size: var(--document-upload-selected-file-label-font-size);
  line-height: var(--document-upload-selected-file-label-line-height);
  color: var(--color-midnight);
  margin: 0 0 var(--document-upload-selected-file-label-margin-bottom) 0;
`;

const SelectedFileName = styled.p`
  font-weight: var(--document-upload-selected-file-name-font-weight);
  font-size: var(--document-upload-selected-file-name-font-size);
  line-height: var(--document-upload-selected-file-name-line-height);
  color: var(--document-upload-selected-file-name-color);
  margin: 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

export function UploadDocumentDialog({
  isOpen,
  documentName,
  onCancel,
  onUpload,
  isUploading,
}: Props) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    setSelectedFile(null);
    onCancel();
  };

  return (
    <DialogOverlay isOpen={isOpen} onClose={handleClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>
          {t("dashboard.documentSection.uploadDialog.title")}
        </Title>
        <Subtitle>
          {t(
            "dashboard.documentSection.uploadDialog.documentType",
            { documentName }
          )}
        </Subtitle>

        <DropZone
          $isDragging={isDragging}
          $hasFile={!!selectedFile}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
        >
          <IconContainer>
            <UploadSimple size={48} weight="regular" />
          </IconContainer>
          <DropZoneText>
            {t(
              "dashboard.documentSection.uploadDialog.dragDropText"
            )}
          </DropZoneText>
          <DropZoneHint>
            {t(
              "dashboard.documentSection.uploadDialog.dragDropHint"
            )}
          </DropZoneHint>
        </DropZone>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInputChange}
        />

        {selectedFile && (
          <SelectedFile>
            <SelectedFileIcon>
              <FilePlus size={24} weight="fill" />
            </SelectedFileIcon>
            <SelectedFileText>
              <SelectedFileLabel>
                {t(
                  "dashboard.documentSection.uploadDialog.selectedFile"
                )}
              </SelectedFileLabel>
              <SelectedFileName>{selectedFile.name}</SelectedFileName>
            </SelectedFileText>
          </SelectedFile>
        )}

        <DialogButtonGroup>
          <PrimaryCancelButton onClick={handleClose} disabled={isUploading}>
            {t("dashboard.documentSection.uploadDialog.cancel")}
          </PrimaryCancelButton>
          <LargePrimaryButton
            onClick={handleUpload}
            $disabled={!selectedFile || isUploading}
            disabled={!selectedFile || isUploading}
          >
            {isUploading
              ? t(
                  "dashboard.documentSection.uploadDialog.uploading"
                )
              : t(
                  "dashboard.documentSection.uploadDialog.upload"
                )}
          </LargePrimaryButton>
        </DialogButtonGroup>
      </Dialog>
    </DialogOverlay>
  );
}
