"use client";
import React, { MouseEvent, RefObject, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import useOutsideClick from "../../hooks/useOutsideClick";
import styles from "./index.module.css";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  items: unknown[];
  copyPath?: string;
  showFirst?: number;
  refParent?: RefObject<HTMLElement>;
  field: ControllerRenderProps<TFieldValues, TName>;
}

export default function MultipleRadioInputsWithMore<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ items, copyPath = "", showFirst = 5, refParent, field }: Props<TFieldValues, TName>) {
  const { t } = useTranslation();
  const [numItems, setNumItems] = useState<number | undefined>(showFirst);
  const { name, onChange, onBlur, value } = field;

  useOutsideClick({
    ref: refParent,
    handler: () => {
      setNumItems(showFirst);
    },
  });

  function handleClick(e: MouseEvent) {
    setNumItems((prev: number | undefined) => (prev ? 0 : showFirst));

    if (e.screenX === 0 && e.screenY === 0) {
      const firstHiddenInput = document.getElementById(`${name}${String(items[showFirst - 1])}`);
      firstHiddenInput?.focus();
    }
  }

  return (
    <>
      {items.map((item: unknown) => {
        const id = `${name}${String(item)}`;
        const isChecked = value === item;
        return (
          <div key={id} className={styles["form-radio-chips"]}>
            <input
              id={id}
              name={name}
              type="radio"
              checked={isChecked}
              onChange={() => {
                onChange(item);
                onBlur();
              }}
            />
            <label htmlFor={id}>{t(`${copyPath}${String(item)}`)}</label>
          </div>
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
