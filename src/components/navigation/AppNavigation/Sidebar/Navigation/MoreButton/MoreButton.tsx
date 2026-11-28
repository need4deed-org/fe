"use client";
import styled from "styled-components";
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { ListIcon } from "@phosphor-icons/react";
import { MainItem, List } from "@/hooks/useAppNavigation";
import { useTranslation } from "react-i18next";
import { MainButton } from "./MainButton";
import { MenuLinkButton } from "./MenuLinkButton";
import { MenuButton } from "./MenuButton";
import { usePathname } from "next/navigation";

type MoreButtonProps = {
  breakpoint: number;
  links: MainItem[];
  lists: List[];
};

const getSelected = (items: MainItem[], lists: List[], pathname: string): boolean => {
  const currentItem = items.find(({ route }) => pathname.includes(route));
  if (currentItem) return true;
  for (const list of lists) {
    const currentItem = list.find((item) => (item.type === "link" ? pathname.includes(item.route) : false));
    if (currentItem) return true;
  }
  return false;
};

export const MoreButton = ({ breakpoint, links, lists }: MoreButtonProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const listId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const selected = getSelected(links, lists, pathname) || menuOpen;

  useEffect(() => {
    if (!menuOpen) return;

    listRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();

    const mobileQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const closeOnDesktop = () => {
      if (!mobileQuery.matches) setMenuOpen(false);
    };
    mobileQuery.addEventListener("change", closeOnDesktop);
    return () => mobileQuery.removeEventListener("change", closeOnDesktop);
  }, [menuOpen, breakpoint]);

  const closeAndFocusToggle = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if (menuOpen && e.key === "Escape") {
      e.stopPropagation();
      closeAndFocusToggle();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setMenuOpen(false);
    }
  };

  return (
    <Container onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <MainButton
        ref={toggleRef}
        aria={{
          current: selected,
          expanded: menuOpen,
          controls: listId,
        }}
        breakpoint={breakpoint}
        selected={selected}
        Icon={ListIcon}
        label={t("dashboard.home.sidebar.more")}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <MenuWrapper $breakpoint={breakpoint} $open={menuOpen}>
        <OverlayCloseButton
          type="button"
          tabIndex={-1}
          aria-hidden
          $breakpoint={breakpoint}
          onClick={closeAndFocusToggle}
        />
        <Menu $breakpoint={breakpoint}>
          <MainList ref={listRef} id={listId} $breakpoint={breakpoint}>
            {links.map(({ route, Icon, label }) => {
              return (
                <ListItem key={route}>
                  <MenuLinkButton href={route} Icon={Icon} label={label} onClick={closeAndFocusToggle} />
                </ListItem>
              );
            })}
          </MainList>
          {lists.map((items, i) => (
            <SecondaryList key={i} $breakpoint={breakpoint}>
              {items.map((item, i) => (
                <ListItem key={i}>
                  {item.type === "link" ? (
                    <MenuLinkButton href={item.route} Icon={item.Icon} label={item.label} />
                  ) : (
                    <MenuButton Icon={item.Icon} label={item.label} onClick={item.onClick} />
                  )}
                </ListItem>
              ))}
            </SecondaryList>
          ))}
        </Menu>
      </MenuWrapper>
    </Container>
  );
};

const Container = styled.li`
  flex: 1;
  z-index: 0;
`;

const MenuWrapper = styled.div<{ $breakpoint: number; $open: boolean }>`
  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: ${({ $open }) => ($open ? "-webkit-flex" : "none")};
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    padding: var(--small-spacing);
    position: fixed;
    top: 0;
    right: 0;
    bottom: var(--mobile-footer-menu-height);
    overflow-y: auto;
    overscroll-behavior: contain;
  }
`;

const OverlayCloseButton = styled.button<{ $breakpoint: number }>`
  display: none;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
`;

const Menu = styled.div<{ $breakpoint: number }>`
  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex-shrink: 0;
    margin-top: auto;
    z-index: 2;
    background-color: var(--misty-lavender);
    border-radius: var(--surface-border-radius);
    overflow: hidden;
  }
`;

const MainList = styled.ul<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);
  padding-left: var(--medium-spacing);
  padding-right: var(--medium-spacing);
  padding-bottom: var(--medium-spacing);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    padding: var(--medium-spacing);
  }
`;

const ListItem = styled.li`
  flex: 1;
  width: 100%;
`;

const SecondaryList = styled.ul<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);
  padding: var(--medium-spacing);
  border-top: var(--border-width) solid var(--pale-lavender);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    padding: var(--medium-spacing);
  }
`;
