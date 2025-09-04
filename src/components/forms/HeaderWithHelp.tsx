"use client";
import { PropsWithChildren, useRef, useState } from "react";
import Help from "../svg/Help";
import useOutsideClick from "../../hooks/useOutsideClick";
import { IncludeClassName } from "./FieldInfo";
import style from "./index.module.css";
import classNames from "classnames";
import Tooltip from "../tooltip";

interface Props extends IncludeClassName {
  titleHelp?: string;
  textHelp?: string;
  className?: string;
  classNamePopup?: string;
}

export default function HeaderWithHelp({
  children,
  textHelp,
  titleHelp,
  className,
  classNamePopup,
}: PropsWithChildren<Props>) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useOutsideClick({ ref: ref as React.RefObject<HTMLElement>, handler: () => setShow(false) });

  return (
    <div className={classNames("n4d-information-tooltip-parent", style["form-section-header"], className)}>
      <h2>
        {children}
        {textHelp ? (
          <button tabIndex={0} ref={ref} type="button" onClick={() => setShow(true)}>
            <Help />
          </button>
        ) : null}
      </h2>
      {show ? (
        <Tooltip className={classNamePopup} close={() => setShow(false)} title={titleHelp}>
          {textHelp}
        </Tooltip>
      ) : null}
    </div>
  );
}
