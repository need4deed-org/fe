"use client";
import styled from "styled-components";
import { Icon } from "@phosphor-icons/react";

type IconButtonProps = {
  Icon: Icon;
  selected?: boolean;
  onClick?: () => void;
};

export const IconButton = ({ Icon, selected = false, onClick }: IconButtonProps) => {
  return (
    <Button $selected={selected} onClick={() => onClick && onClick()}>
      {<Icon />}
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
  background-color: ${({ $selected }) => ($selected ? "var(--lavender-80)" : "var(--lavender-100)")};
  border-radius: 50%;
  transition: var(--short-transition);

  &:hover,
  &:active,
  &:focus {
    background-color: var(--lavender-80);
  }

  svg {
    width: var(--field-icon-size);
    height: var(--field-icon-size);
    fill: var(--white);
  }
`;
