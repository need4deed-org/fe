import styled from "styled-components";
import Link from "next/link";

type LinkButtonProps = {
  href: string;
  inline?: boolean;
  label: string;
};

export const LinkButton = ({ href, inline = false, label }: LinkButtonProps) => {
  return (
    <Button href={href} $inline={inline}>
      {label}
    </Button>
  );
};

const Button = styled(Link)<{ $inline: boolean }>`
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
`;
