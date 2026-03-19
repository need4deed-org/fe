"use client";
import style from "./index.module.css";

export interface IncludeClassName {
  className?: string;
}

interface Props {
  error?: string | string[];
  className?: string;
}

export default function FieldInfo({ error, className }: Props) {
  const errorMsg = Array.isArray(error) ? error.join(", ") : error;

  return <div className={`${style["form-error"]} ${className}`}>{errorMsg ? <em>{errorMsg}</em> : null}</div>;
}
