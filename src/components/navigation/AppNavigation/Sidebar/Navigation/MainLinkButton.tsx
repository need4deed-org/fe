"use client";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@phosphor-icons/react";
import { ComponentType } from "react";

type MainLinkButtonProps = {
  href: string;
  breakpoint: number;
  Icon: Icon;
  label: string;
  Badge?: ComponentType;
};

export const MainLinkButton = ({ href, breakpoint, Icon, label, Badge }: MainLinkButtonProps) => {
  const pathname = usePathname();
  const selected = pathname.startsWith(href);

  return (
    <Button aria-current={selected ? "page" : undefined} href={href} $breakpoint={breakpoint} $selected={selected}>
      {<Icon aria-hidden weight="bold" />}
      {label}
      {Badge ? <Badge /> : null}
    </Button>
  );
};

const Button = styled(Link)<{ $selected: boolean; $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  align-items: center;
  position: relative;
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
    width: var(--field-icon-size);
    height: var(--field-icon-size);
    fill: ${({ $selected }) => ($selected ? "var(--white)" : "var(--blue-100)")};
    transition: fill var(--short-transition);
  }

  &:hover > svg,
  &:active > svg,
  &:focus-visible > svg {
    fill: var(--white);
  }

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex-direction: column;
    justify-content: center;
    gap: var(--very-small-spacing);
    padding: var(--small-spacing);
    width: 100%;
    height: 100%;
    font-family: var(--condensed-sans-serif);
    font-size: var(--mobile-menu-font-size);
    text-transform: uppercase;

    > svg {
      width: var(--mobile-menu-icon-size);
      height: var(--mobile-menu-icon-size);
    }
  }
`;
