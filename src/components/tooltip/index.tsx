import { ReactNode } from "react";
import Close from "../svg/Close";
import style from "./index.module.css";

interface Props {
  title?: string;
  children?: ReactNode;
  className?: string;
  closeComponent?: ReactNode;
  close?: () => void;
}

export default function Popup({ className, children, title, close, closeComponent = <Close /> }: Props) {
  return (
    <div className={className || style["popup-information-tooltip"]}>
      {title && <h1>{title}</h1>}
      {children}
      <button tabIndex={0} type="button" onClick={() => close && close()}>
        {closeComponent}
      </button>
    </div>
  );
}
