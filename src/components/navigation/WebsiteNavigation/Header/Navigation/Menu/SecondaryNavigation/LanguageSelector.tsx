"use client";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { TranslateIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Lang } from "need4deed-sdk";
import { useSearchParams } from "next/navigation";
import { IconButton } from "@/components/navigation/WebsiteNavigation/Header/Navigation/Menu/SecondaryNavigation/IconButton";

type LanguageSelectorProps = {
  breakpoint: number;
};

export const LanguageSelector = ({ breakpoint }: LanguageSelectorProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const listId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      listRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }
  }, [open]);

  const closeAndFocusToggle = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (open && e.key === "Escape") {
      e.stopPropagation();
      closeAndFocusToggle();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  const selectLanguage = (newLang: Lang) => {
    handleLanguageChange(newLang);
    closeAndFocusToggle();
  };

  const handleLanguageChange = (newLang: Lang) => {
    const currentLang = language;

    if (currentLang !== newLang) {
      const segments = pathname.split("/");

      segments[1] = newLang;

      const newPath = segments.join("/");
      const query = searchParams.toString();

      router.push(query ? `${newPath}?${query}` : newPath);
    }
  };

  return (
    <Wrapper onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <IconButton
        ref={toggleRef}
        Icon={TranslateIcon}
        label={t("website.header.language")}
        selected={open}
        expanded={open}
        controls={listId}
        onClick={() => setOpen(!open)}
      />
      <MenuWrapper $open={open} $breakpoint={breakpoint}>
        <OverlayCloseButton type="button" tabIndex={-1} aria-hidden onClick={closeAndFocusToggle} />
        <Menu ref={listRef} id={listId} $breakpoint={breakpoint}>
          <li>
            <Button
              type="button"
              lang={Lang.DE}
              aria-current={language === Lang.DE}
              $selected={language === Lang.DE}
              onClick={() => selectLanguage(Lang.DE)}
            >
              Deutsch
            </Button>
          </li>
          <li>
            <Button
              type="button"
              lang={Lang.EN}
              aria-current={language === Lang.EN}
              $selected={language === Lang.EN}
              onClick={() => selectLanguage(Lang.EN)}
            >
              English
            </Button>
          </li>
        </Menu>
      </MenuWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const MenuWrapper = styled.div<{ $open: boolean; $breakpoint: number }>`
  display: ${({ $open }) => ($open ? "block" : "none")};
  position: absolute;
  left: 0;
  z-index: 0;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    top: 0;
  }
`;

const OverlayCloseButton = styled.button`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: transparent;
  border: none;
`;

const Menu = styled.ul<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);
  position: relative;
  padding: var(--medium-spacing);
  margin: 0;
  margin-top: var(--small-spacing);
  z-index: 2;
  background-color: var(--lavender-60);
  border-radius: var(--surface-border-radius);
  list-style: none;
  list-style-type: none;

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    position: absolute;
    left: 0;
    bottom: var(--small-spacing);
    margin: 0;
  }
`;

const Button = styled.button<{ $selected: boolean }>`
  display: -webkit-flex;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: ${({ $selected }) => ($selected ? "var(--lavender-100) !important" : "transparent")};
  border-radius: var(--field-border-radius);
  font-weight: var(--bold);
  color: var(--white);
  transition: background-color var(--short-transition);

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--lavender-80);
  }
`;
