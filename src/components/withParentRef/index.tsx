import {
  Children,
  PropsWithChildren,
  ReactElement,
  cloneElement,
  useRef,
} from "react";

import { IncludeClassName } from "../forms/FieldInfo";

type Props = { onFocus?: () => void } & IncludeClassName & PropsWithChildren;

export default function WithParentRef({ children, className, onFocus }: Props) {
  const refParent = useRef<HTMLDivElement>(null);
  return (
    <div className={className} ref={refParent} onFocus={onFocus}>
      {Children.map(children, (child) =>
        cloneElement(child as ReactElement, { refParent } as Partial<unknown>),
      )}
    </div>
  );
}
