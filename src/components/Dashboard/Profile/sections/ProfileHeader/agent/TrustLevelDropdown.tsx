"use client";
import { useClickOutside } from "@/hooks";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { statusColorMap, statusIconMap } from "../../../common/statusMaps";
import { AgentTrustLevel } from "../../../types/agent";
import { IconWrapper } from "../common/profileHeaderStyles";
import { Container, Menu, MenuItem, Trigger } from "./styles";

type Props = {
  value: AgentTrustLevel;
  options: readonly AgentTrustLevel[];
  labels: Record<AgentTrustLevel, string>;
  onChange: (value: AgentTrustLevel) => void;
};

export const TrustLevelDropdown = ({ value, options, labels, onChange }: Props) => {
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
