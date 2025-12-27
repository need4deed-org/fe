import { useState } from "react";
import styled from "styled-components";
import { ArrowLeft, DownloadSimple, Trash, Plus, Minus } from "@phosphor-icons/react";

type Props = {
  isOpen: boolean;
  documentName: string;
  documentUrl: string;
  onClose: () => void;
  onDownload: () => void;
  onDelete: () => void;
};

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 38, 132, 0.25);
  justify-content: center;
  align-items: center;
  z-index: 10002;
`;

const ContentArea = styled.div`
  position: relative;
  width: 1340px;
  height: 944px;
  max-width: 95vw;
  max-height: 95vh;
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
  background: #2F2F30;
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
  font-family: 'Figtree', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: 0.005em;
  color: #FFFFFF;
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
  color: #FFFFFF;
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
  align-items: center;
  overflow: auto;
  background: rgba(0, 0, 0, 0.1);
`;

const DocumentFrame = styled.div<{ $scale: number }>`
  width: 595px;
  height: 842px;
  background: #FFFFFF;
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
  align-items: flex-start;
  padding: 16px;
  gap: 32px;
  position: absolute;
  bottom: 74px;
  left: 50%;
  transform: translateX(-50%);
  background: #2F2F30;
  opacity: 0.8;
  border-radius: 16px;
  z-index: 3;
`;

const PageInfo = styled.div`
  font-family: 'Figtree', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  color: #FFFFFF;
`;

const ZoomOptions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 16px;
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
  color: #FFFFFF;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export function DocumentPreviewDialog({
  isOpen,
  documentName,
  documentUrl,
  onClose,
  onDownload,
  onDelete,
}: Props) {
  const [scale, setScale] = useState(1);
  const [currentPage] = useState(1);
  const [totalPages] = useState(2);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
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
            <PDFEmbed data={documentUrl} type="application/pdf" aria-label={documentName}>
              <p>Your browser does not support PDFs. <a href={documentUrl}>Download the PDF</a>.</p>
            </PDFEmbed>
          </DocumentFrame>
        </DocumentContainer>

        <ZoomControls>
          <PageInfo>
            Page {currentPage}/{totalPages}
          </PageInfo>
          <ZoomOptions>
            <ZoomButton onClick={handleZoomOut} disabled={scale <= 0.5} aria-label="Zoom out">
              <Minus size={24} weight="regular" />
            </ZoomButton>
            <ZoomButton onClick={handleZoomIn} disabled={scale >= 2} aria-label="Zoom in">
              <Plus size={24} weight="regular" />
            </ZoomButton>
          </ZoomOptions>
        </ZoomControls>
      </ContentArea>
    </Overlay>
  );
}
