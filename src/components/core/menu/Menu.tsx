"use client";

import { useClickOutside } from "@/hooks";
import React, { createContext, useContext, useRef, useState, useCallback, type ReactNode } from "react";
import styled from "styled-components";

interface MenuContextType {
  isOpen: boolean;
  selectItem: (onSelect: () => void) => void;
  close: () => void;
  toggle: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const useMenuContext = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("Menu compound components must be used within <Menu>");
  }
  return ctx;
};

const Container = styled.div<{ $inFlow: boolean }>`
  position: relative;
  display: inline-flex;
  flex-direction: ${({ $inFlow }) => ($inFlow ? "column" : "row")};
`;

const TargetButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  color: inherit;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const DropdownDiv = styled.div<{ $align: "left" | "right"; $inFlow: boolean }>`
  position: ${({ $inFlow }) => ($inFlow ? "static" : "absolute")};
  top: 100%;
  ${({ $align }) => ($align === "right" ? "right: 0;" : "left: 0;")}
  z-index: 10;
  margin: var(--spacing-4) 0 0;
  padding: var(--spacing-8) 0;
  background: var(--color-white);
  border-radius: var(--border-radius-xs);
  box-shadow: var(--dropdown-box-shadow);
  min-width: 140px;
`;

const ItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-12);
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  white-space: nowrap;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const sizeMap = {
  s: { fontSize: "var(--font-size-14)", lineHeight: "var(--line-height-20)" },
  m: { fontSize: "var(--font-size-16)", lineHeight: "var(--line-height-24)" },
  l: { fontSize: "var(--font-size-24)", lineHeight: "var(--line-height-32)" },
  xl: { fontSize: "var(--font-size-32)", lineHeight: "var(--line-height-40)" },
} as const;

const fwMap = {
  regular: "var(--font-weight-regular)",
  semibold: "var(--font-weight-semibold)",
  bold: "var(--font-weight-bold)",
} as const;

const ItemTextStyled = styled.span<{ $size: keyof typeof sizeMap; $fw: keyof typeof fwMap }>`
  font-size: ${({ $size }) => sizeMap[$size].fontSize};
  line-height: ${({ $size }) => sizeMap[$size].lineHeight};
  letter-spacing: var(--letter-spacing-tight);
  font-weight: ${({ $fw }) => fwMap[$fw]};
  color: var(--color-blue-700);
`;

function ItemText({
  children,
  size = "m",
  fw = "regular",
}: {
  children: ReactNode;
  size?: keyof typeof sizeMap;
  fw?: keyof typeof fwMap;
}) {
  return (
    <ItemTextStyled $size={size} $fw={fw}>
      {children}
    </ItemTextStyled>
  );
}

const ItemContentStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-8);
  width: 100%;
`;

function ItemContentWrapper({ children }: { children: ReactNode }) {
  return <ItemContentStyled>{children}</ItemContentStyled>;
}

interface MenuProps {
  children: ReactNode;
  inFlow?: boolean;
  closeOnSelect?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

function Menu({ children, inFlow = false, closeOnSelect = true, open, onOpen, onClose }: MenuProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? open : internalOpen;

  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
      onClose?.();
    }
  }, [isControlled, onClose]);

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (isControlled) {
      if (next) onOpen?.();
      else onClose?.();
    } else {
      setInternalOpen(next);
      if (next) onOpen?.();
      else onClose?.();
    }
  }, [isControlled, isOpen, onOpen, onClose]);

  const selectItem = useCallback(
    (onSelect: () => void) => {
      onSelect();
      if (closeOnSelect) {
        if (inFlow) ref.current?.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')?.focus();
        if (isControlled) {
          onClose?.();
        } else {
          setInternalOpen(false);
          onClose?.();
        }
      }
    },
    [closeOnSelect, inFlow, isControlled, onClose],
  );

  useClickOutside(ref, close);

  return (
    <MenuContext.Provider value={{ isOpen, selectItem, close, toggle }}>
      <Container ref={ref} $inFlow={inFlow}>
        {children}
      </Container>
    </MenuContext.Provider>
  );
}

function Target({ children, label, disabled }: { children: ReactNode; label?: string; disabled?: boolean }) {
  const { toggle, isOpen } = useMenuContext();

  return (
    <TargetButton
      type="button"
      disabled={disabled}
      aria-label={label}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
    >
      {children}
    </TargetButton>
  );
}

interface DropdownProps {
  children: ReactNode;
  align?: "left" | "right";
  inFlow?: boolean;
}

function Dropdown({ children, align = "left", inFlow = false }: DropdownProps) {
  const { isOpen } = useMenuContext();

  if (!isOpen) return null;

  return (
    <DropdownDiv $align={align} $inFlow={inFlow} role="menu">
      {children}
    </DropdownDiv>
  );
}

interface ItemProps {
  children: ReactNode;
  onSelect: () => void;
}

function Item({ children, onSelect }: ItemProps) {
  const { selectItem } = useMenuContext();

  return (
    <ItemButton
      role="menuitem"
      onClick={(e) => {
        e.stopPropagation();
        selectItem(onSelect);
      }}
    >
      {children}
    </ItemButton>
  );
}

Menu.Target = Target;
Menu.Dropdown = Dropdown;
Menu.Item = Item;

export { Menu, ItemText, ItemContentWrapper };
