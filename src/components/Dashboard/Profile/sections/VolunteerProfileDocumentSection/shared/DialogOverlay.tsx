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
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: ${(props) => props.$zIndex};
`;

export function DialogOverlay({ isOpen, onClose, children, zIndex = 10001 }: Props) {
  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} $zIndex={zIndex} onClick={onClose}>
      {children}
    </Overlay>
  );
}
