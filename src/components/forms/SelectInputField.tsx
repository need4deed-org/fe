"use client";
import { DeepKeys, DeepValue, FieldApi, useForm } from "@tanstack/react-form";
import { Lang } from "need4deed-sdk";
import React, { useMemo, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Selected } from "./types";
import style from "./index.module.css";
import { Button } from "../core/button";
import { LanguageLevel, LanguageObject } from "@/types";

interface Props<T, K extends DeepKeys<T>> {
  label: string;
  showFirst?: number;
  field: FieldApi<T, K>;
  form: ReturnType<typeof useForm<T>>;
  id: number;
  prevLevel: "languagesNative" | "languagesFluent" | "languagesIntermediate";
  prevLanguage: string;
  languageArray: Array<LanguageObject>;
  disabledLanguages: Array<string>;
  showRemove: boolean;
  removeLanguage: (id: number) => void;
  updateLanguage: (id: number, newLang: string) => void;
  updateLevel: (id: number, newLevel: LanguageLevel) => void;
}

export default function SelectInputField<T, K extends DeepKeys<T>>({
  label,
  field,
  languageArray,
  disabledLanguages,
  prevLevel,
  prevLanguage,
  form,
  id,
  showRemove,
  removeLanguage,
  updateLanguage,
  updateLevel,
}: Props<T, K>) {
  const { t, i18n } = useTranslation();

  const languageLevels: Array<LanguageLevel> = [LanguageLevel.NATIVE, LanguageLevel.FLUENT, LanguageLevel.INTERMEDIATE];

  const currentLangArray = useMemo(
    () => languageArray.filter((l) => l.level === prevLevel).map((item) => item.language),
    [languageArray, prevLevel],
  );

  const handlePrevValue = () => {
    if (prevLanguage) {
      const oldLevelLanguages = form.state.values[prevLevel as keyof T] as Selected[];
      const oldLangIndex = oldLevelLanguages.findIndex((item) => item.id === prevLanguage);

      if (oldLangIndex !== -1) {
        form.setFieldValue(`${String(prevLevel)}[${oldLangIndex}].selected` as DeepKeys<T>, false as DeepValue<T, K>);
      }
    } else {
      return;
    }
  };

  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target) {
      const newLangLevelKey = e.target.value as keyof T;
      const newLevelLanguages = form.state.values[newLangLevelKey] as Selected[];
      const newLangIndex = newLevelLanguages.findIndex((item) => item.id === prevLanguage);

      if (newLangIndex !== -1) {
        form.setFieldValue(
          `${String(newLangLevelKey)}[${newLangIndex}].selected` as DeepKeys<T>,
          true as DeepValue<T, K>,
        );
      }
    } else {
      return;
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newArr = [...currentLangArray].filter((item) => item !== prevLanguage);
    const currentLanguages = field.state.value as Selected[];
    const newLanguages = currentLanguages.map((item) => ({
      ...item,
      selected: item.id === e.target.value || newArr.some((lang) => lang === item.id),
    }));
    field.handleChange(newLanguages as DeepValue<T, K>);
  };

  return (
    <div className={style["form-languages-grid"]}>
      <label className={style["form-form-field"]}>
        <span>{label}</span>
        <select
          name={prevLevel}
          onBlur={field.handleBlur}
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
          {field.state.value &&
            (field.state.value as Selected[])?.map((item: Selected) => (
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
