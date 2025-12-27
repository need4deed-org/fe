import { ArrowLeft, DownloadSimple, MagnifyingGlassPlus, Minus, Plus, Trash } from "@phosphor-icons/react";
import { useState } from "react";
import styled from "styled-components";
import { DialogOverlay } from "./shared/DialogOverlay";

type Props = {
  isOpen: boolean;
  documentName: string;
  documentUrl: string;
  onClose: () => void;
  onDownload: () => void;
  onDelete: () => void;
};

const ContentArea = styled.div`
  position: relative;
  width: 1340px;
  height: 944px;
  max-width: 75vw;
  max-height: 95vh;
  background: linear-gradient(135deg, #c5b8e0 0%, #a594c8 100%);
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.24), 0px 16px 64px rgba(0, 0, 0, 0.16);
`;

const PreviewBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 32px;
  position: absolute;
  width: 100%;
  height: 56px;
  left: 0px;
  top: 0px;
  background: #2f2f30;
  z-index: 2;
`;

const DocumentNameSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 13px;
`;

const BackButton = styled.button`
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-aubergine);
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const DocumentName = styled.div`
  font-family: "Figtree", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: 0.005em;
  color: #ffffff;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 21px;
`;

const IconButton = styled.button`
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const DocumentContainer = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 56px);
  top: 56px;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
  padding: 32px 0;
`;

const DocumentFrame = styled.div<{ $scale: number }>`
  width: 595px;
  height: 842px;
  background: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(${(props) => props.$scale});
  transform-origin: center center;
  transition: transform 0.2s ease;
`;

const PDFEmbed = styled.object`
  width: 100%;
  height: 100%;
  border: none;
`;

const ZoomControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  gap: 16px;
  position: absolute;
  bottom: 74px;
  left: 50%;
  transform: translateX(-50%);
  background: #2f2f30;
  opacity: 0.8;
  border-radius: 16px;
  z-index: 3;
`;

const ZoomButton = styled.button`
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export function DocumentPreviewDialog({ isOpen, documentName, documentUrl, onClose, onDownload, onDelete }: Props) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
  };

  return (
    <DialogOverlay isOpen={isOpen} onClose={onClose} zIndex={10002}>
      <ContentArea onClick={(e) => e.stopPropagation()}>
        <PreviewBar>
          <DocumentNameSection>
            <BackButton onClick={onClose} aria-label="Close preview">
              <ArrowLeft size={24} weight="regular" />
            </BackButton>
            <DocumentName>{documentName}</DocumentName>
          </DocumentNameSection>
          <ActionButtons>
            <IconButton onClick={onDownload} aria-label="Download document">
              <DownloadSimple size={24} weight="regular" />
            </IconButton>
            <IconButton onClick={onDelete} aria-label="Delete document">
              <Trash size={24} weight="regular" />
            </IconButton>
          </ActionButtons>
        </PreviewBar>

        <DocumentContainer>
          <DocumentFrame $scale={scale}>
            <PDFEmbed data={`${documentUrl}#toolbar=0&navpanes=0`} type="application/pdf" aria-label={documentName}>
              <p>
                Your browser does not support PDFs. <a href={documentUrl}>Download the PDF</a>.
              </p>
            </PDFEmbed>
          </DocumentFrame>
        </DocumentContainer>

        <ZoomControls data-testid="document-preview-zoom-controls">
          <ZoomButton onClick={handleZoomOut} disabled={scale <= 0.5} aria-label="Zoom out">
            <Minus size={24} weight="regular" />
          </ZoomButton>
          <ZoomButton onClick={handleZoomReset} aria-label="Reset zoom">
            <MagnifyingGlassPlus size={24} weight="regular" />
          </ZoomButton>
          <ZoomButton onClick={handleZoomIn} disabled={scale >= 2} aria-label="Zoom in">
            <Plus size={24} weight="regular" />
          </ZoomButton>
        </ZoomControls>
      </ContentArea>
    </DialogOverlay>
  );
}
