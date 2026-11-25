"use client";
import styled from "styled-components";
import { Icon } from "@phosphor-icons/react";
import type { Ref } from "react";

type IconButtonProps = {
  Icon: Icon;
  label: string;
  selected?: boolean;
  expanded?: boolean;
  controls?: string;
  onClick?: () => void;
  ref?: Ref<HTMLButtonElement>;
};

export const IconButton = ({ Icon, label, selected = false, expanded, controls, onClick, ref }: IconButtonProps) => {
  return (
    <Button
      ref={ref}
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      $selected={selected}
      onClick={() => onClick && onClick()}
    >
      <Icon aria-hidden />
    </Button>
  );
};

const Button = styled.button<{ $selected: boolean }>`
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--field-size);
  height: var(--field-size);
  background-color: ${({ $selected }) => ($selected ? "var(--blue-80)" : "var(--blue-100)")};
  border-radius: var(--pill-field-border-radius);
  transition: var(--short-transition);

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--blue-80);
  }

  > svg {
    width: var(--field-icon-size);
    height: var(--field-icon-size);
    fill: var(--white);
  }
`;
