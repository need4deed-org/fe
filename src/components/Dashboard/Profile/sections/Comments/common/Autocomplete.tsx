import React, { useLayoutEffect, useMemo, useState } from "react";
import { AutocompleteContainer, AutocompleteRow } from "./styles";
import { ApiUserGet, SortOrder, UserRole } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import { apiPathUser, cacheTTL, defaultAvatarVolunteerProfile } from "@/config/constants";
import { AvatarImg } from "../../OpportunityVolunteers/styles";
import { getImageUrl } from "@/utils";
import getCaretCoordinates from "textarea-caret";
import { useDebounce } from "@/hooks/useDebounce";

type Props = {
  handleTagAdd: (userId: number, username: string) => void;
  newCommentText: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export default function Autocomplete({ handleTagAdd, newCommentText, textAreaRef }: Props) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const userFilter = useMemo(() => {
    if (!newCommentText || !textAreaRef?.current) return "";
    const cursorPosition = textAreaRef?.current.selectionStart;
    const textBeforeCaret = newCommentText.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCaret.lastIndexOf("@");
    if (lastAtIndex === -1) return "";
    const textAfterAt = textBeforeCaret.substring(lastAtIndex + 1);
    if (textAfterAt.includes(" ")) return null;
    return textAfterAt.toLowerCase();
  }, [newCommentText]);

  const debouncedUserFilter = useDebounce(userFilter, 200);

  const { data: users } = useGetQuery<ApiUserGet[]>({
    queryKey: ["users", debouncedUserFilter ?? ""],
    apiPath: apiPathUser,
    params: {
      sortOrder: SortOrder.NewToOld,
      filter: { search: debouncedUserFilter, role: UserRole.COORDINATOR },
    },
    enabled: debouncedUserFilter !== null,
    staleTime: cacheTTL,
  });

  const handleUserSelect = (userId: number, firstName: string) => {
    handleTagAdd(userId, firstName);
  };

  const resolvedAvatarUrl = (url: string) => {
    return getImageUrl(url || defaultAvatarVolunteerProfile);
  };

  useLayoutEffect(() => {
    const el = textAreaRef?.current;
    if (!el && !debouncedUserFilter) return;
    const textBeforeCaret = debouncedUserFilter?.substring(0, el?.selectionStart);
    const lastAtIndex = textBeforeCaret?.lastIndexOf("@");

    if (!el) return;
    const positioningIndex = lastAtIndex !== -1 ? lastAtIndex : el.selectionStart;

    const caret = getCaretCoordinates(el, positioningIndex ?? 0);

    setCoords({
      top: caret.top + 20 - el?.scrollTop,
      left: caret.left - el?.scrollLeft,
    });
  }, [debouncedUserFilter, textAreaRef]);

  return (
    users &&
    users?.length > 0 && (
      <AutocompleteContainer
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
        }}
      >
        {users.map((user) => (
          <AutocompleteRow key={user.id} onClick={() => handleUserSelect(user.id, user.firstName)}>
            <AvatarImg src={resolvedAvatarUrl(user.avatarUrl)} alt={user.fullName} />
            <AutocompleteRow>{user.fullName}</AutocompleteRow>
          </AutocompleteRow>
        ))}
      </AutocompleteContainer>
    )
  );
}
