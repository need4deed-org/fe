import Link from "next/link";
import { useState, useCallback, useEffect } from "react";

export function useCommentTag(
  value: string,
  setNewCommentText?: React.Dispatch<React.SetStateAction<string>>,
  textAreaRef?: React.RefObject<HTMLTextAreaElement | null> | null,
  userIds?: number[],
) {
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const renderHighlightedText = useCallback(() => {
    if (!value) return null;
    let count = -1;
    const regexTag = /((?<=^|\s)@[\w\s]+?)(?=\s|$)/g;
    const parts = value.split(regexTag);

    return parts.map((part, idx) => {
      const cleanPart = part?.trim();
      const confirmedTag = tags?.find((t) => `@${t.name}` === part);

      if (confirmedTag) {
        return (
          <Link href={`/volunteers/${confirmedTag?.id}`} key={`${confirmedTag?.id}-${idx}`} className="tag">
            {cleanPart}
          </Link>
        );
      }
      if (userIds?.length && part.includes("@")) {
        count++;
        return (
          <Link href={`/volunteers/${userIds[count]}`} key={`${userIds[count]}-${idx}`} className="tag">
            {part}
          </Link>
        );
      }
      return part;
    });
  }, [value, tags]);

  const handleTagAdd = (userId: number, firstName: string) => {
    if (!value || !textAreaRef?.current) return;
    const cursorPosition = textAreaRef.current.selectionStart;
    const textBeforeCaret = value.substring(0, cursorPosition);
    const textAfterCaret = value.substring(cursorPosition);
    const lastAtIndex = textBeforeCaret.lastIndexOf("@");

    const newText = textBeforeCaret.substring(0, lastAtIndex) + `@${firstName} ` + textAfterCaret;

    setNewCommentText?.(newText);
    setTags((prev) => [...prev, { id: userId, name: firstName }]);
    setShowAutocomplete(false);
  };

  useEffect(() => {
    if (!textAreaRef?.current) return;
    const cursorPosition = textAreaRef.current?.selectionStart;
    const textBeforeCaret = value.substring(0, cursorPosition || 0);

    if (textBeforeCaret.includes("@") && !textBeforeCaret.split("@").pop()?.includes(" ")) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }, [value]);

  return {
    renderHighlightedText,
    showAutocomplete,
    setShowAutocomplete,
    handleTagAdd,
  };
}
