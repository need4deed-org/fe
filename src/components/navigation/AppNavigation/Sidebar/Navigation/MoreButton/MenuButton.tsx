"use client";
import styled from "styled-components";
import { Icon } from "@phosphor-icons/react";

type MenuButtonProps = {
  Icon: Icon;
  label: string;
  onClick: () => void;
};

export const MenuButton = ({ Icon, label, onClick }: MenuButtonProps) => {
  return (
    <Button onClick={() => onClick()}>
      {<Icon aria-hidden weight="bold" />}
      {label}
    </Button>
  );
};

const Button = styled.button`
  display: -webkit-flex;
  display: flex;
  align-items: center;
  gap: var(--small-spacing);
  width: 100%;
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: transparent;
  border-radius: var(--field-border-radius);
  font-weight: var(--bold);
  color: var(--blue-100);
  white-space: nowrap;
  transition:
    background-color var(--short-transition),
    color var(--short-transition);

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--blue-80);
    color: var(--white);
  }

  > svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    fill: var(--blue-100);
    transition: fill var(--short-transition);
  }

  &:hover > svg,
  &:active > svg,
  &:focus-visible > svg {
    fill: var(--white);
  }
`;
