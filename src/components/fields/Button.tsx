"use client";
import styled from "styled-components";

type ButtonProps = {
  label: string;
  inline?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const Button = ({ label, inline = false, disabled = false, onClick }: ButtonProps) => {
  return (
    <ButtonElement $inline={inline} disabled={disabled} onClick={() => onClick && onClick()}>
      {label}
    </ButtonElement>
  );
};

const ButtonElement = styled.button<{ $inline: boolean }>`
  display: ${({ $inline }) => ($inline ? "-webkit-inline-flex" : "-webkit-flex")};
  display: ${({ $inline }) => ($inline ? "inline-flex" : "flex")};
  justify-content: center;
  align-items: center;
  width: ${({ $inline }) => ($inline ? "auto" : "100%")};
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: var(--lavender-100);
  border-radius: var(--field-border-radius);
  font-weight: var(--bold);
  color: var(--white);
  text-transform: capitalize;
  white-space: nowrap;
  transition: var(--short-transition);

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--lavender-80);
  }

  &:disabled {
    background-color: var(--lavender-80);
    color: var(--lavender-20);
  }
`;
