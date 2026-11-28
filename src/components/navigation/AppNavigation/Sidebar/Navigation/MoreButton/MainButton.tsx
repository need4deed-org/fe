"use client";
import styled from "styled-components";
import { Icon } from "@phosphor-icons/react";
import { Ref } from "react";

type MainButtonProps = {
  breakpoint: number;
  selected: boolean;
  ref: Ref<HTMLButtonElement>;
  aria: {
    current: boolean;
    expanded: boolean;
    controls: string;
  };
  Icon: Icon;
  label: string;
  onClick: () => void;
};

export const MainButton = ({
  breakpoint,
  selected,
  ref,
  aria: { current, expanded, controls },
  Icon,
  label,
  onClick,
}: MainButtonProps) => {
  return (
    <ButtonElement
      type="button"
      $breakpoint={breakpoint}
      $selected={selected}
      ref={ref}
      aria-current={current}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={() => onClick()}
    >
      {<Icon aria-hidden weight="bold" />}
      {label}
    </ButtonElement>
  );
};

const ButtonElement = styled.button<{ $breakpoint: number; $selected: boolean }>`
  display: none;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: -webkit-flex;
    display: flex;
    gap: var(--very-small-spacing);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--small-spacing);
    width: 100%;
    height: 100%;
    background-color: ${({ $selected }) => ($selected ? "var(--blue) !important" : "transparent")};
    border-radius: var(--field-border-radius);
    font-family: var(--condensed-sans-serif);
    font-size: var(--mobile-menu-font-size);
    font-weight: var(--bold);
    color: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue)")};
    text-transform: uppercase;

    &:hover,
    &:active,
    &:focus-visible {
      background-color: var(--medium-blue);
      color: var(--white);
    }

    > svg {
      width: var(--mobile-menu-icon-size);
      height: var(--mobile-menu-icon-size);
      fill: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue)")};
    }

    &:hover > svg,
    &:active > svg,
    &:focus-visible > svg {
      fill: var(--white);
    }
  }
`;
