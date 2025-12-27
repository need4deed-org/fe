import { useTranslation } from "react-i18next";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import styled from "styled-components";
import { UploadSimple, FilePlus } from "@phosphor-icons/react";
import { DialogOverlay } from "./shared/DialogOverlay";
import { DialogButtonGroup, PrimaryCancelButton, LargePrimaryButton } from "./shared/DialogButtonGroup";

type Props = {
  isOpen: boolean;
  documentName: string;
  onCancel: () => void;
  onUpload: (file: File) => void;
};

const Dialog = styled.div`
  background: var(--color-white);
  border-radius: 24px;
  padding: 48px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  font-family: "Figtree", sans-serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  color: var(--color-midnight);
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-family: "Figtree", sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  color: var(--color-midnight);
  margin: 0 0 32px 0;
`;

const DropZone = styled.div<{ $isDragging: boolean; $hasFile: boolean }>`
  border: 2px dashed ${(props) => (props.$isDragging ? "var(--color-aubergine)" : "#D1D5DB")};
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  background: ${(props) => (props.$isDragging ? "var(--color-aubergine-subtle)" : "#F9FAFB")};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--color-aubergine);
    background: var(--color-aubergine-subtle);
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--color-aubergine);
`;

const DropZoneText = styled.p`
  font-family: "Figtree", sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: var(--color-midnight);
  margin: 0 0 8px 0;
`;

const DropZoneHint = styled.p`
  font-family: "Figtree", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #6B7280;
  margin: 0;
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-aubergine-subtle);
  border-radius: 12px;
  margin-bottom: 32px;
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
  font-family: "Figtree", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-midnight);
  margin: 0 0 4px 0;
`;

const SelectedFileName = styled.p`
  font-family: "Figtree", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #6B7280;
  margin: 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

export function UploadDocumentDialog({ isOpen, documentName, onCancel, onUpload }: Props) {
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
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onCancel();
  };

  return (
    <DialogOverlay isOpen={isOpen} onClose={handleClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{t("dashboard.volunteerProfile.documentSection.uploadDialog.title")}</Title>
        <Subtitle>{t("dashboard.volunteerProfile.documentSection.uploadDialog.documentType", { documentName })}</Subtitle>

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
          <DropZoneText>{t("dashboard.volunteerProfile.documentSection.uploadDialog.dragDropText")}</DropZoneText>
          <DropZoneHint>{t("dashboard.volunteerProfile.documentSection.uploadDialog.dragDropHint")}</DropZoneHint>
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
                {t("dashboard.volunteerProfile.documentSection.uploadDialog.selectedFile")}
              </SelectedFileLabel>
              <SelectedFileName>{selectedFile.name}</SelectedFileName>
            </SelectedFileText>
          </SelectedFile>
        )}

        <DialogButtonGroup>
          <PrimaryCancelButton onClick={handleClose}>
            {t("dashboard.volunteerProfile.documentSection.uploadDialog.cancel")}
          </PrimaryCancelButton>
          <LargePrimaryButton onClick={handleUpload} $disabled={!selectedFile} disabled={!selectedFile}>
            {t("dashboard.volunteerProfile.documentSection.uploadDialog.upload")}
          </LargePrimaryButton>
        </DialogButtonGroup>
      </Dialog>
    </DialogOverlay>
  );
}
