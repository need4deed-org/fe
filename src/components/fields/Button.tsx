"use client";
import styled from "styled-components";

type ButtonProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const Button = ({ label, selected = false, disabled = false, onClick }: ButtonProps) => {
  return (
    <ButtonElement $selected={selected} disabled={disabled} onClick={() => onClick && onClick()}>
      {label}
    </ButtonElement>
  );
};

const ButtonElement = styled.button<{ $selected: boolean }>`
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: ${({ $selected }) => ($selected ? "var(--blue-75)" : "var(--blue-100)")};
  border-radius: var(--field-border-radius);
  font-weight: var(--bold);
  color: var(--white);
  text-transform: capitalize;
  transition: var(--short-transition);

  &:hover,
  &:active,
  &:focus {
    background-color: var(--blue-75);
  }

  &:disabled {
    background-color: var(--blue-75);
    color: var(--blue-25);
  }
`;
