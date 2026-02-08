"use client";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import styled from "styled-components";
import {
  statusColorMap,
  statusIconMap,
} from "../../../common/statusMaps";
import { AgentTrustLevel } from "../../../types/agent";
import { useClickOutside } from "./useClickOutside";

const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

const Trigger = styled.button<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  background-color: ${({ $bg }) => $bg};
  color: var(--color-blue-700);
  border: none;
  cursor: pointer;
  white-space: nowrap;
`;

const Menu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  margin: var(--spacing-4) 0 0;
  padding: var(--spacing-8) 0;
  list-style: none;
  background: var(--color-white);
  border-radius: var(--border-radius-xs);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  min-width: 140px;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-8) var(--spacing-16);
  font-size: var(--font-size-lg);
  color: var(--color-blue-700);
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const IconWrapper = styled.span`
  width: var(--status-badge-icon-size);
  height: var(--status-badge-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  value: AgentTrustLevel;
  options: readonly AgentTrustLevel[];
  labels: Record<AgentTrustLevel, string>;
  onChange: (value: AgentTrustLevel) => void;
};

export const TrustLevelDropdown = ({
  value,
  options,
  labels,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  const bg = statusColorMap[value] ?? "var(--color-grey-50)";
  const CurrentIcon = statusIconMap[value];

  return (
    <Container ref={ref} data-testid="trust-level-dropdown">
      <Trigger $bg={bg} onClick={() => setOpen((prev) => !prev)}>
        {CurrentIcon && (
          <IconWrapper>
            <CurrentIcon size={20} color="var(--color-blue-700)" />
          </IconWrapper>
        )}
        <span>{labels[value]}</span>
        <CaretDownIcon size={16} color="var(--color-blue-700)" />
      </Trigger>

      {open && (
        <Menu data-testid="trust-level-dropdown-menu">
          {options.map((option) => {
            const OptionIcon = statusIconMap[option];
            return (
              <MenuItem
                key={option}
                data-testid={`trust-level-option-${option}`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {OptionIcon && (
                  <IconWrapper>
                    <OptionIcon size={20} color="var(--color-blue-700)" />
                  </IconWrapper>
                )}
                <span>{labels[option]}</span>
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </Container>
  );
};
