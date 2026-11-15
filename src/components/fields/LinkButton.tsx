import styled from "styled-components";
import Link from "next/link";

type LinkButtonProps = {
  href: string;
  label: string;
};

export const LinkButton = ({ href, label }: LinkButtonProps) => {
  return <Button href={href}>{label}</Button>;
};

const Button = styled(Link)`
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: var(--blue-100);
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
`;
