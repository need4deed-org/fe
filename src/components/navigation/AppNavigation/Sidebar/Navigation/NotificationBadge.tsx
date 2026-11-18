import styled from "styled-components";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetTaggedComments } from "@/hooks/useGetTaggedComments";

type NotificationBadgeProps = {
  breakpoint: number;
};

export const NotificationBadge = ({ breakpoint }: NotificationBadgeProps) => {
  const user = useCurrentUser();
  const personId = (user as typeof user & { personId?: number })?.personId ?? -1;
  const { tagComments, isLoading, isError } = useGetTaggedComments(personId);
  const unreadTaggedComments = tagComments
    ?.flatMap((comment) => comment.taggedPersons)
    ?.filter((comment) => !comment.readAt && personId === comment.id);
  const count = unreadTaggedComments?.length || 0;

  if (isLoading || isError || count === 0) return;

  return <Badge $breakpoint={breakpoint}>{count}</Badge>;
};

const Badge = styled.span<{ $breakpoint: number }>`
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
  background-color: var(--raspberry-100);
  border-radius: var(--notification-badge-border-radius);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    top: var(--small-spacing);
  }
`;
