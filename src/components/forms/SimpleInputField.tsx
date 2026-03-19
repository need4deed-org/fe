"use client";
import React from "react";
import type { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";
import style from "./index.module.css";
import { InputType } from "./types";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  label: string;
  infoMsg?: string;
  inputType?: InputType;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  error?: string | undefined;
}

export default function SimpleInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ field, label, infoMsg, inputType = "text", onFocus, error }: Props<TFieldValues, TName>) {
  const { name, onBlur, onChange, value } = field;

  return (
    <>
      {infoMsg && <i className={style["simple-input-form-info"]}>{infoMsg}</i>}
      <label htmlFor={name} className={style["form-form-field"]} onFocus={onFocus}>
        <span>{label}</span>
        <input
          id={name}
          name={name}
          type={inputType}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          value={(value as string | number | undefined) ?? ""}
        />
        {error ? (
          <div className={style["simple-input-form-error"]}>
            <em>{error}</em>
          </div>
        ) : null}
      </label>
    </>
  );
}
