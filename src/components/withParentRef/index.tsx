import { Children, cloneElement, PropsWithChildren, ReactElement, useRef } from "react";
import { IncludeClassName } from "../forms/FieldInfo";

type Props = { onFocus?: () => void } & IncludeClassName & PropsWithChildren;

export default function WithParentRef({ children, className, onFocus }: Props) {
  const refParent = useRef<HTMLDivElement>(null);

  // Avoid accessing ref during render: pass a function prop so children can obtain the ref safely.
  return (
    <div className={className} ref={refParent} onFocus={onFocus}>
      {Children.map(children, (child) =>
        cloneElement(child as ReactElement, { getRefParent: () => refParent } as Partial<unknown>),
      )}
    </div>
  );
}
