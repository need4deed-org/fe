"use client";
import React, { useMemo, type ChangeEvent } from "react";
import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import {
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
  type FieldPath,
  type Path,
  type PathValue,
} from "react-hook-form";
import { Selected } from "./types";
import style from "./index.module.css";
import { Button } from "../core/button";
import { LanguageLevel, LanguageObject } from "@/types";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  label: string;
  field: ControllerRenderProps<TFieldValues, TName>;
  id: number;
  prevLevel: LanguageLevel;
  prevLanguage: string;
  languageArray: Array<LanguageObject>;
  disabledLanguages: Array<string>;
  showRemove: boolean;
  removeLanguage: (id: number) => void;
  updateLanguage: (id: number, newLang: string) => void;
  updateLevel: (id: number, newLevel: LanguageLevel) => void;
}

export default function SelectInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  field,
  languageArray,
  disabledLanguages,
  prevLevel,
  prevLanguage,
  id,
  showRemove,
  removeLanguage,
  updateLanguage,
  updateLevel,
}: Props<TFieldValues, TName>) {
  const { t, i18n } = useTranslation();
  const { getValues, setValue } = useFormContext<TFieldValues>();

  const languageLevels: Array<LanguageLevel> = [LanguageLevel.NATIVE, LanguageLevel.FLUENT, LanguageLevel.INTERMEDIATE];

  const currentLangArray = useMemo(
    () =>
      languageArray.filter((l: LanguageObject) => l.level === prevLevel).map((item: LanguageObject) => item.language),
    [languageArray, prevLevel],
  );

  const handlePrevValue = () => {
    if (prevLanguage) {
      const values = getValues();
      const oldLevelLanguages = (values[String(prevLevel)] as Selected[]) || [];
      const oldLangIndex = oldLevelLanguages.findIndex((item) => item.id === prevLanguage);

      if (oldLangIndex !== -1) {
        const path = `${String(prevLevel)}.${oldLangIndex}.selected` as Path<TFieldValues>;
        setValue(path, false as PathValue<TFieldValues, Path<TFieldValues>>);
      }
    }
  };

  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target) {
      const newLangLevelKey = e.target.value as string;
      const values = getValues();
      const newLevelLanguages = (values[newLangLevelKey] as Selected[]) || [];
      const newLangIndex = newLevelLanguages.findIndex((item) => item.id === prevLanguage);

      if (newLangIndex !== -1) {
        const path = `${String(newLangLevelKey)}.${newLangIndex}.selected` as Path<TFieldValues>;
        setValue(path, true as PathValue<TFieldValues, Path<TFieldValues>>);
      }
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newArr = [...currentLangArray].filter((item) => item !== prevLanguage);
    const currentLanguages = (field.value as Selected[]) || [];
    const newLanguages = currentLanguages.map((item) => ({
      ...item,
      selected: item.id === e.target.value || newArr.some((lang) => lang === item.id),
    }));
    field.onChange(newLanguages);
  };

  return (
    <div className={style["form-languages-grid"]}>
      <label className={style["form-form-field"]}>
        <span>{label}</span>
        <select
          name={prevLevel}
          onBlur={field.onBlur}
          value={prevLanguage}
          onChange={(e) => {
            handlePrevValue();
            handleLanguageChange(e);
            updateLanguage(id, e.target.value);
          }}
        >
          <option value="" disabled hidden>
            {t("form.becomeVolunteer.fields.languages.chooseLanguage")}
          </option>
          {field.value &&
            (field.value as Selected[])?.map((item: Selected) => (
              <option key={item.id} value={item.id} disabled={disabledLanguages.some((lang) => lang === item.id)}>
                {item.title[i18n.language as Lang]}
              </option>
            ))}
        </select>
      </label>
      <label className={style["form-form-field"]}>
        <span>Level</span>
        <select
          name={prevLevel}
          value={prevLevel}
          onChange={(e) => {
            handlePrevValue();
            handleLevelChange(e);
            updateLevel(id, e.target.value as LanguageLevel);
          }}
        >
          {languageLevels.map((level, idx) => (
            <option key={idx} id={`${level}`} value={level}>
              {t(`form.becomeVolunteer.fields.languages.${level}.header`)}
            </option>
          ))}
        </select>
      </label>
      {showRemove && (
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            removeLanguage(id);
            handlePrevValue();
          }}
          text={t("form.becomeVolunteer.fields.languages.removeLanguage")}
          textFontSize="1rem"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          height="3rem"
        />
      )}
    </div>
  );
}
