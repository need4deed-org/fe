import { useRef, useState } from "react";

type UseCommentMenuReturn = {
  openMenuCommentId: number | null;
  menuButtonRefs: React.MutableRefObject<{ [key: number]: HTMLButtonElement | null }>;
  toggleMenu: (commentId: number) => void;
  closeMenu: () => void;
};

export function useCommentMenu(): UseCommentMenuReturn {
  const [openMenuCommentId, setOpenMenuCommentId] = useState<number | null>(null);
  const menuButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const toggleMenu = (commentId: number) => {
    setOpenMenuCommentId((prev) => (prev === commentId ? null : commentId));
  };

  const closeMenu = () => {
    setOpenMenuCommentId(null);
  };

  return {
    openMenuCommentId,
    menuButtonRefs,
    toggleMenu,
    closeMenu,
  };
}
