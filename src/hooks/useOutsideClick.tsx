import { useEffect } from "react";

interface Props {
  ref?: React.RefObject<HTMLElement>; // The element to monitor
  handler: (event: Event) => void; // The function to call when a click outside is detected
  msTimeout?: number; // Optional: Delay before calling the handler
}

export default function useOutsideClick({
  ref,
  handler,
  msTimeout = 0,
}: Props) {
  useEffect(() => {
    const listener = (event: Event) => {
      // Check if the click is outside the ref element
      if (!ref?.current || ref.current.contains(event.target as Node)) return;

      // Call the handler with an optional delay
      if (msTimeout > 0) {
        setTimeout(() => handler(event), msTimeout);
      } else {
        handler(event);
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", listener);
    document.addEventListener("focusin", listener);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("focusin", listener);
    };
  }, [ref, handler, msTimeout]); // Add `msTimeout` to the dependency array

  return null;
}
