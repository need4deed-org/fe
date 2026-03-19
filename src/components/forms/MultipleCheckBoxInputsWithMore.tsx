"use client";
import React, { MouseEvent, RefObject, useState } from "react";
import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type FieldPath,
  type Path,
  type PathValue,
} from "react-hook-form";

import useOutsideClick from "../../hooks/useOutsideClick";
import { Selected } from "./types";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  showFirst?: number;
  refParent?: RefObject<HTMLElement>;
  field: {
    name: TName;
    value: PathValue<TFieldValues, TName>;
    onBlur: () => void;
  };
  hiddenChips?: string[];
}

export default function MultipleCheckBoxInputsWithMore<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ showFirst = 8, refParent, field, hiddenChips = [] }: Props<TFieldValues, TName>) {
  const { t, i18n } = useTranslation();
  const { control } = useFormContext<TFieldValues>();
  const [numItems, setNumItems] = useState<number | undefined>(showFirst);
  const { name, value, onBlur } = field;

  useOutsideClick({
    ref: refParent,
    handler: () => {
      setNumItems(showFirst);
    },
  });

  function handleClick(e: MouseEvent) {
    setNumItems((prev: number | undefined) => (prev ? 0 : showFirst));

    if (e.screenX === 0 && e.screenY === 0) {
      const firstHiddenInput = document.getElementById(`${name}${showFirst - 1}`);
      firstHiddenInput?.focus();
    }
  }

  const items = (Array.isArray(value) ? value : []) as Selected[];

  return (
    <>
      {items.map((item, idx) => {
        const itemName = `${name}.${idx}.selected` as Path<TFieldValues>;
        return (
          <Controller
            key={item.id}
            name={itemName}
            control={control}
            render={({ field: innerField }) => (
              <div
                data-main-item={numItems === 0 || idx < (numItems ?? 0) || item.selected}
                data-chip-hidden={hiddenChips.some((chip: string) => chip === item.id)}
              >
                <input
                  tabIndex={0}
                  id={`${name}${idx}`}
                  type="checkbox"
                  checked={innerField.value as boolean}
                  onBlur={() => {
                    innerField.onBlur();
                    onBlur();
                  }}
                  onChange={(e) => {
                    innerField.onChange(e.target.checked);
                  }}
                />
                <label htmlFor={`${name}${idx}`}>{item.title[i18n.language as Lang]}</label>
              </div>
            )}
          />
        );
      })}
      {items.length > showFirst && (numItems || !refParent) ? (
        <button type="button" tabIndex={0} onClick={handleClick}>
          {numItems ? t("form.button.more") : t("form.button.less")}
        </button>
      ) : null}
    </>
  );
}
