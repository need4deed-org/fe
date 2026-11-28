import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetTaggedComments } from "@/hooks/useGetTaggedComments";

export const NotificationBadge = () => {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const personId = (user as typeof user & { personId?: number })?.personId ?? -1;
  const { tagComments, isLoading, isError } = useGetTaggedComments(personId);
  const unreadTaggedComments = tagComments
    ?.flatMap((comment) => comment.taggedPersons)
    ?.filter((comment) => !comment.readAt && personId === comment.id);
  const count = unreadTaggedComments?.length || 0;

  if (isLoading || isError || count === 0) return;

  return (
    <>
      <Badge aria-label={`, ${t("dashboard.home.sidebar.unreadMentions", { count })}`}>{count}</Badge>
    </>
  );
};

const Badge = styled.span`
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: calc(var(--small-spacing) * -1);
  right: calc(var(--small-spacing) * -1);
  min-width: var(--notification-badge-size);
  height: var(--notification-badge-size);
  padding-left: var(--notification-badge-side-spacing);
  padding-right: var(--notification-badge-side-spacing);
  background-color: var(--scarlet);
  border-radius: var(--notification-badge-border-radius);
  font-size: var(--small-font-size);
  font-weight: normal;
`;
