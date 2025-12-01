import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";

import MenuItem from "./MenuItem";
import { Paragraph } from "../styled/text";

const en = "EN";
const de = "DE";

const LanguageSwitcherContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--app-header-language-switcher-gap);
`;

interface Props {
  textColor?: string;
}

export default function LanguageSwitcher({ textColor }: Props) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const handleLangChange = (newLang: Lang) => {
    const currentLang = i18n.language;

    if (currentLang !== newLang) {
      const segments = pathname.split("/");

      segments[1] = newLang;

      const newPath = segments.join("/");

      router.push(newPath);
    }
  };

  return (
    <LanguageSwitcherContainer>
      <MenuItem
        text={en}
        color={textColor}
        onClick={() => handleLangChange(Lang.EN)}
        fontWeight={i18n.language !== Lang.EN ? "var(--app-header-menu-item-fontWeight-secondary)" : undefined}
      />

      <Paragraph
        color={textColor}
        fontWeight={"var(--app-header-menu-item-fontWeight-secondary)"}
        fontSize="var(--homepage-hero-section-header-menu-item-fontSize)"
      >
        |
      </Paragraph>

      <MenuItem
        text={de}
        color={textColor}
        onClick={() => handleLangChange(Lang.DE)}
        fontWeight={i18n.language !== Lang.DE ? "var(--app-header-menu-item-fontWeight-secondary)" : undefined}
      />
    </LanguageSwitcherContainer>
  );
}
