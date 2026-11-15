"use client";
import styled from "styled-components";
import { PlusIcon, FadersIcon } from "@phosphor-icons/react";
import { IconButton } from "../fields/IconButton";
import { SearchInput } from "@/components/fields/SearchInput";

type PageHeaderProps = {
  search: {
    value: string;
    onChange: (value: string) => void;
  };
  onAddClick?: () => void;
};

export const PageHeader = ({ search, onAddClick }: PageHeaderProps) => {
  return (
    <Header>
      <SearchInput placeholder="Search..." value={search.value} onChange={search.onChange} />
      <IconButton Icon={FadersIcon} />
      {onAddClick && <IconButton Icon={PlusIcon} onClick={() => onAddClick()} />}
    </Header>
  );
};

const Header = styled.header`
  display: -webkit-flex;
  display: flex;
  align-items: center;
  gap: var(--small-spacing);
  width: 100%;
  height: var(--header-height);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  position: sticky;
  top: 0;
  background-color: var(--mint);
`;
