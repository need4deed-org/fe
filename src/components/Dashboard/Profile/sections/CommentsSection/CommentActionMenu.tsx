import { useTranslation } from "react-i18next";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  anchorElement: HTMLElement | null;
};

const MenuContainer = styled.div<{ $isOpen: boolean; $top: number; $right: number }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  padding: var(--spacing-8) 0;
  position: fixed;
  width: 336px;
  background: var(--color-white);
  box-shadow: 0px 10px 30px -12px rgba(143, 81, 138, 0.2);
  border-radius: 0px 0px var(--spacing-8) var(--spacing-8);
  z-index: 1000;
  top: ${(props) => props.$top}px;
  right: ${(props) => props.$right}px;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: var(--spacing-12);
  gap: var(--spacing-8);
  width: 100%;
  background: var(--color-white);
  border: none;
  cursor: pointer;
  font-family: "Figtree";
  font-style: normal;
  font-weight: ${(props) => (props.$danger ? 600 : 400)};
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.005em;
  color: ${(props) => (props.$danger ? "var(--color-red-600)" : "var(--color-midnight)")};
  text-align: left;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.$danger ? "var(--color-white)" : "var(--color-pink-50)")};
  }

  &:first-child:hover {
    background: var(--color-pink-50);
  }
`;

export function CommentActionMenu({ isOpen, onClose, onEdit, onDelete, anchorElement }: Props) {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useLayoutEffect(() => {
    if (isOpen && anchorElement) {
      const rect = anchorElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen, anchorElement]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorElement &&
        !anchorElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, anchorElement]);

  if (!isOpen) return null;

  return (
    <MenuContainer ref={menuRef} $isOpen={isOpen} $top={position.top} $right={position.right}>
      <MenuItem onClick={onEdit}>{t("dashboard.volunteerProfile.commentsSection.editComment")}</MenuItem>
      <MenuItem $danger onClick={onDelete}>
        {t("dashboard.volunteerProfile.commentsSection.deleteComment")}
      </MenuItem>
    </MenuContainer>
  );
}
