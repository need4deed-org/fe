import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import MenuItem from "./MenuItem";
import { setStoredLang } from "@/utils/helpers";

const en = "ENGLISH";
const de = "DEUTSCH";

interface Props {
  textColor?: string;
}

export default function LanguageSwitcher({ textColor }: Props) {
  const { i18n } = useTranslation();

  const handleLangChange = (lang: Lang) => {
    i18n.changeLanguage(lang);
    setStoredLang(lang);
  };

  return (
    <MenuItem
      text={i18n.language === Lang.EN ? de : en}
      color={textColor}
      onClick={() => handleLangChange(i18n.language === Lang.EN ? Lang.DE : Lang.EN)}
    />
  );
}
