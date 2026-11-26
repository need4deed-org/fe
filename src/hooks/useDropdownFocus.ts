import { KeyboardEvent, RefObject, useEffect } from "react";

export function useDropdownFocus({
  ready,
  containerRef,
  triggerRef,
  close,
  includeButtons = false,
}: {
  ready: boolean;
  containerRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  close: () => void;
  includeButtons?: boolean;
}) {
  const controlSelector = includeButtons
    ? 'button:not(:disabled), input[type="checkbox"]:not(:disabled)'
    : 'input[type="checkbox"]:not(:disabled)';

  useEffect(() => {
    if (ready) {
      containerRef.current?.querySelector<HTMLElement>(controlSelector)?.focus({ preventScroll: true });
    }
  }, [ready, containerRef, controlSelector]);

  return (event: KeyboardEvent<HTMLElement>) => {
    if (!ready) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      triggerRef.current?.focus({ preventScroll: true });
    } else if (event.key === "Tab") {
      const controls = containerRef.current?.querySelectorAll<HTMLElement>(controlSelector);
      if (!controls?.length) return;
      if (event.shiftKey && event.target === controls[0]) {
        event.preventDefault();
        close();
        triggerRef.current?.focus({ preventScroll: true });
      } else if (!event.shiftKey && event.target === controls[controls.length - 1]) {
        close();
        triggerRef.current?.focus({ preventScroll: true });
      }
    }
  };
}
