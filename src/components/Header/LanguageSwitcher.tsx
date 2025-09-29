import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";

import MenuItem from "./MenuItem";
import { Paragraph } from "../styled/text";
import { QueryParams } from "@/config/constants";

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
  const searchParams = useSearchParams();

  const handleLangChange = (lang: Lang) => {
    if (i18n.language !== lang) {
      // Create a new URLSearchParams instance to manage the query params
      const params = new URLSearchParams(searchParams.toString());
      params.set(QueryParams.Language, lang);

      // Update the URL without a full page reload
      router.push(`?${params.toString()}`);
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
