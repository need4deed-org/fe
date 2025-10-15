import React, { useState, useCallback, useRef } from "react";
import styled, { css } from "styled-components";
import { CaretDown, Check } from "@phosphor-icons/react";
import useOutsideClick from "@/hooks/useOutsideClick";
// import { useOnClickOutside } from "../hooks/useOnClickOutside";


export interface DropdownOption {
  id: number | string;
  label: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  selected: DropdownOption[]; 
  onSelect: (options: DropdownOption[]) => void; 
  placeholder?: string;
  width?: string;
  menuWidth?: string;
  isMulti?: boolean; 
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selected = [],
  onSelect,
  placeholder = "Not set",
  width = "200px",
  menuWidth,
  isMulti = false, 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick({ ref: dropdownRef as React.RefObject<HTMLElement>, handler: () => setIsOpen(false) });

  const handleSelect = useCallback(
    (option: DropdownOption) => {
      if (isMulti) {
        const isSelected = selected.some((item) => item.value === option.value);
        const updatedSelection = isSelected
          ? selected.filter((item) => item.value !== option.value) // Remove if already selected
          : [...selected, option]; // Add if not selected
        onSelect(updatedSelection);
      } else {
        onSelect([option]); // Wrap single selection in an array
        setIsOpen(false);
      }
    },
    [onSelect, selected, isMulti],
  );

  const displayedOptions = isMulti
    ? selected.map((item) => item.label).join(", ") || placeholder
    : selected[0]?.label || placeholder;

  return (
    <Wrapper ref={dropdownRef} $width={menuWidth || width}>
      {label && <Label>{label}</Label>}

      <SelectBox
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
        $selectionColor={isMulti ? undefined : selected[0]?.color}
        $isNotSet={!selected.length}
      >
        <SelectedItem>
          <span>{displayedOptions}</span>
        </SelectedItem>
        <CaretDown size={16} weight="bold" />
      </SelectBox>

      {isOpen && (
        <DropdownMenu $menuWidth={menuWidth || width}>
          {options.map((option) => (
            <DropdownItem
              key={option.id}
              $isSelected={selected.some((item) => item.value === option.value)}
              onClick={() => handleSelect(option)}
            >
              {selected.some((item) => item.value === option.value) ? (
                <Check size={16} weight="bold" />
              ) : (
                <span style={{ width: 16 }} />
              )}
              <Pill $color={option.color}>
                {option.icon && <Icon>{option.icon}</Icon>}
                <span>{option.label}</span>
              </Pill>
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Wrapper>
  );
};



const Wrapper = styled.div<{ $width: string }>`
  position: relative;
  width: ${({ $width }) => $width};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

const Label = styled.div`
  color: #1a1a3d;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
`;

const SelectBox = styled.div<{ $isOpen: boolean; $selectionColor?: string; $isNotSet: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  white-space: nowrap; 
  overflow: hidden; 

 
  ${({ $selectionColor }) =>
    `
          background-color:${$selectionColor};
          color: var(--color-midnight);
          border-color: #e2e2f0;
        `}
`;

const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
  flex: 1; 
`;

const DropdownMenu = styled.div<{ $menuWidth: string }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: ${({ $menuWidth }) => $menuWidth}; 
  min-width: 100%; 
  background: #ffffff;
  border: 1px solid #eceaf5;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(108, 108, 128, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 300px; 
  overflow-y: auto; 
`;

const DropdownItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 36px;
  white-space: nowrap; 

  & > svg {
    color: var(--color-midnight);
    flex-shrink: 0; 
  }

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: var(--color-violet-20);
    `}

  &:hover {
    background-color: var(--color-violet-20);
  }
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; 
`;


const Pill = styled.div<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap; 

  ${({ $color }) =>
    `background-color: ${$color};
    color: var(--color-midnight);
        `}
`;
