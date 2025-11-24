import { Lang, QueryParams } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  // const searchParams = useSearchParams();

  // const handleLangChange = (lang: Lang) => {

  //   if (i18n.language !== lang) {
  //     // Create a new URLSearchParams instance to manage the query params
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(QueryParams.Language, lang);

  //     // Update the URL without a full page reload
  //     router.push(`?${params.toString()}`);
  //   }
  // };

  const pathname = usePathname();

  const handleLangChange = (newLang: Lang) => {
    const currentLang = i18n.language;

    if (currentLang !== newLang) {
      // 1. Split the pathname into segments
      // Example: "/en/dashboard/volunteers" -> ["", "en", "dashboard", "volunteers"]
      const segments = pathname.split("/");

      // 2. The language is expected to be the second segment (index 1).
      // We check if the current segment matches a known language before replacing.
      const currentSegment = segments[1];

      if (currentSegment === Lang.EN || currentSegment === Lang.DE) {
        // Replace the current language segment with the new language
        segments[1] = newLang;

        // 3. Rejoin the segments to form the new path
        const newPath = segments.join("/");

        // 4. Navigate to the new path. This triggers the Next.js routing
        // which causes the RootLayout to pick up the new language param.
        router.push(newPath);

        // MOCK ONLY: Update i18n state locally for the mock to reflect the change
        i18n.changeLanguage(newLang);
      } else {
        console.error(`Language segment not found or is unexpected. Current path: ${pathname}`);
        // Fallback: If the path is just /, push the new language root
        router.push(`/${newLang}`);
      }
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
