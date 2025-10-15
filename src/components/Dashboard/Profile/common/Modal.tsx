import React from "react";
import styled from "styled-components";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  closeButton?: boolean;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  margin-top: 1rem;
`;

const Modal: React.FC<ModalProps> = ({ title, children, onClose, closeButton }) => {
  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <Title>{title}</Title>
          {closeButton && <CloseButton onClick={onClose}>&times;</CloseButton>}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
