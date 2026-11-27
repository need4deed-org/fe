import styled from "styled-components";
import { IconLink } from "@/types/Link";
import { UserRole } from "need4deed-sdk";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import {
  BuildingsIcon,
  CalendarDotsIcon,
  ChatsCircleIcon,
  HandHeartIcon,
  SquaresFourIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NotificationBadge } from "./NotificationBadge";
import { MoreButton } from "./MoreButton";
import { MainLinkButton } from "./MainLinkButton";
import { ComponentType } from "react";

export type MenuLink = IconLink & {
  roles: UserRole[];
  Badge?: ComponentType;
};

type NavigationProps = {
  breakpoint: number;
};

export const Navigation = ({ breakpoint }: NavigationProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const user = useCurrentUser();
  const links: MenuLink[] = [
    {
      route: ROUTES.dashboard(language),
      Icon: SquaresFourIcon,
      label: t("dashboard.home.sidebar.dashboard"),
      roles: [UserRole.VOLUNTEER, UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
      Badge: NotificationBadge,
    },
    {
      route: ROUTES.volunteers(language),
      Icon: UsersThreeIcon,
      label: t("dashboard.home.sidebar.volunteers"),
      roles: [UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: ROUTES.opportunities(language),
      Icon: HandHeartIcon,
      label: t("dashboard.home.sidebar.opportunities"),
      roles: [UserRole.VOLUNTEER, UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: ROUTES.organizations(language),
      Icon: BuildingsIcon,
      label: t("dashboard.home.sidebar.organizations"),
      roles: [UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: ROUTES.discussions(language),
      Icon: ChatsCircleIcon,
      label: t("dashboard.home.sidebar.discussions"),
      roles: [UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: ROUTES.calendar(language),
      Icon: CalendarDotsIcon,
      label: t("dashboard.home.sidebar.calendar"),
      roles: [UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
  ];

  if (!user) return;
  const roleLinks = links.filter(({ roles }) => roles.includes(user.role));
  const MAX_MOBILE_ITEMS = 5;
  const mainLinks = roleLinks.length > MAX_MOBILE_ITEMS ? roleLinks.slice(0, MAX_MOBILE_ITEMS - 1) : roleLinks;
  const moreLinks = roleLinks.length > MAX_MOBILE_ITEMS ? roleLinks.slice(MAX_MOBILE_ITEMS - 1) : [];

  return (
    <Background $breakpoint={breakpoint} aria-label={t("website.header.mainNavigation")}>
      <List $breakpoint={breakpoint}>
        {mainLinks.map(({ route, Icon, label, Badge }) => {
          return (
            <ListItem key={route} $breakpoint={breakpoint}>
              <MainLinkButton href={route} breakpoint={breakpoint} Icon={Icon} label={label} Badge={Badge} />
            </ListItem>
          );
        })}
        {moreLinks.length ? <MoreButton breakpoint={breakpoint} links={moreLinks} /> : null}
      </List>
    </Background>
  );
};

const Background = styled.nav<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  align-items: center;
  gap: var(--medium-spacing);
  height: 100%;
`;

const List = styled.ul<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);
  width: 100%;
  padding-top: var(--medium-spacing);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: var(--small-spacing);
  }
`;

const ListItem = styled.li<{ $breakpoint: number }>`
  flex: 1;
  height: 100%;
  padding-left: var(--medium-spacing);
  padding-right: var(--medium-spacing);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    padding: 0;
  }
`;
