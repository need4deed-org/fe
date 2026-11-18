"use client";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { TranslateIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Lang } from "need4deed-sdk";
import { useSearchParams } from "next/navigation";
import { IconButton } from "@/components/fields/IconButton";
import { Button } from "@/components/fields/Button";

type LanguageSelectorProps = {
  breakpoint: number;
};

export const LanguageSelector = ({ breakpoint }: LanguageSelectorProps) => {
  const {
    i18n: { language },
  } = useTranslation();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    <Wrapper>
      <IconButton Icon={TranslateIcon} selected={open} onClick={() => setOpen(true)} />
      <MenuWrapper $open={open} $breakpoint={breakpoint}>
        <OverlayCloseButton onClick={() => setOpen(false)} />
        <Menu $breakpoint={breakpoint}>
          <li>
            <Button label="Deutsch" selected={language === Lang.DE} onClick={() => handleLanguageChange(Lang.DE)} />
          </li>
          <li>
            <Button label="English" selected={language === Lang.EN} onClick={() => handleLanguageChange(Lang.EN)} />
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
  outline: none;
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
  background-color: var(--blue-50);
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
