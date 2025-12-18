import { TFunction } from "i18next";
import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/core/button";
import { LanguageLevel, LanguageObject } from "@/types";
import useList from "@/hooks/useLists";
import { ListsOfOptions } from "../types";
import style from "../index.module.css";

type Props = {
  language: LanguageObject;
  disabledLanguages: string[];
  showRemove: boolean;
  onUpdateLanguage: (id: number, language: string) => void;
  onUpdateLevel: (id: number, level: LanguageLevel) => void;
  onRemove: (id: number) => void;
  t: TFunction<"translation", undefined>;
};

const languageLevels: LanguageLevel[] = [LanguageLevel.NATIVE, LanguageLevel.FLUENT, LanguageLevel.INTERMEDIATE];

const levelToI18nKey: Record<LanguageLevel, string> = {
  [LanguageLevel.NATIVE]: "languagesNative",
  [LanguageLevel.FLUENT]: "languagesFluent",
  [LanguageLevel.INTERMEDIATE]: "languagesIntermediate",
};

export function LanguageFieldRow({
  language,
  disabledLanguages,
  showRemove,
  onUpdateLanguage,
  onUpdateLevel,
  onRemove,
  t,
}: Props) {
  const { i18n } = useTranslation();
  const availableLanguages = useList(ListsOfOptions.LANGUAGES);

  return (
    <div className={style["form-languages-grid"]} data-testid={`language-row-${language.id}`}>
      <label className={style["form-form-field"]}>
        <span>Language</span>
        <select
          name={`language-${language.id}`}
          value={language.language}
          onChange={(e) => onUpdateLanguage(language.id, e.target.value)}
        >
          <option value="" disabled hidden>
            {t("form.becomeVolunteer.fields.languages.chooseLanguage")}
          </option>
          {availableLanguages.map((item) => (
            <option
              key={item.id}
              value={item.id}
              disabled={disabledLanguages.includes(item.id) && language.language !== item.id}
            >
              {item.title[i18n.language as Lang]}
            </option>
          ))}
        </select>
      </label>
      <label className={style["form-form-field"]}>
        <span>Level</span>
        <select
          name={`level-${language.id}`}
          value={language.level}
          onChange={(e) => onUpdateLevel(language.id, e.target.value as LanguageLevel)}
        >
          <option value="" disabled hidden>
            {t("form.becomeVolunteer.fields.languages.chooseLevel")}
          </option>
          {languageLevels.map((level) => (
            <option key={level} value={level}>
              {t(`form.becomeVolunteer.fields.languages.${levelToI18nKey[level]}.header`)}
            </option>
          ))}
        </select>
      </label>
      {showRemove ? (
        <div className={style["remove-language-button"]}>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onRemove(language.id);
            }}
            text={t("form.becomeVolunteer.fields.languages.removeLanguage")}
            textFontSize="20px"
            textFontWeight="600"
            backgroundcolor="transparent"
            textColor="#4B5BD4"
            border="none"
            height="auto"
            padding="0.5rem"
          />
        </div>
      ) : (
        <div className={style["language-button-spacer"]} />
      )}
    </div>
  );
}
