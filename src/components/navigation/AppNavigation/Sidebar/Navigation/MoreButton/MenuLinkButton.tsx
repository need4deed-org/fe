"use client";
import styled from "styled-components";
import Link from "next/link";
import { Icon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

type MenuLinkButtonProps = {
  href: string;
  Icon: Icon;
  label: string;
  onClick?: () => void;
};

export const MenuLinkButton = ({ href, Icon, label, onClick }: MenuLinkButtonProps) => {
  const pathname = usePathname();
  const selected = pathname.startsWith(href);

  return (
    <Button
      href={href}
      aria-controls={selected ? "page" : undefined}
      $selected={selected}
      onClick={() => onClick && onClick()}
    >
      <Icon aria-hidden weight="bold" />
      {label}
    </Button>
  );
};

const Button = styled(Link)<{ $selected: boolean }>`
  display: -webkit-flex;
  display: flex;
  align-items: center;
  gap: var(--small-spacing);
  width: 100%;
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: ${({ $selected }) => ($selected ? "var(--blue-100) !important" : "transparent")};
  border-radius: var(--field-border-radius);
  font-weight: var(--bold);
  color: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue-100)")};
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
    fill: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue-100)")};
    transition: fill var(--short-transition);
  }

  &:hover > svg,
  &:active > svg,
  &:focus-visible > svg {
    fill: var(--white);
  }
`;
