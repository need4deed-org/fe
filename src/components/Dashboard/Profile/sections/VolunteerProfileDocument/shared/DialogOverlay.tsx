import { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  zIndex?: number;
};

const Overlay = styled.div<{ $isOpen: boolean; $zIndex: number }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--document-dialog-overlay-background);
  justify-content: center;
  align-items: center;
  z-index: ${(props) => props.$zIndex};
`;

export function DialogOverlay({ isOpen, onClose, children, zIndex }: Props) {
  const defaultZIndex = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--document-dialog-overlay-z-index') || '10001');
  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} $zIndex={zIndex ?? defaultZIndex} onClick={onClose}>
      {children}
    </Overlay>
  );
}
