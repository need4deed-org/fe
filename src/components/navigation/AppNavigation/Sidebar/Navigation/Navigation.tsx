import styled from "styled-components";
import { IconLink } from "@/types/Link";
import { UserRole } from "need4deed-sdk";
import { routes } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import {
  BuildingsIcon,
  CalendarDotsIcon,
  ChatsCircleIcon,
  HandHeartIcon,
  SquaresFourIcon,
  UsersThreeIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBadge } from "./NotificationBadge";
import { MoreButton } from "./MoreButton";

export type MenuLink = IconLink & {
  roles: UserRole[];
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
  const pathname = usePathname();
  const links: MenuLink[] = [
    {
      route: routes.dashboard(language),
      Icon: SquaresFourIcon,
      label: t("dashboard.home.sidebar.dashboard"),
      roles: [UserRole.VOLUNTEER, UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.volunteers(language),
      Icon: UsersThreeIcon,
      label: t("dashboard.home.sidebar.volunteers"),
      roles: [UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.opportunities(language),
      Icon: HandHeartIcon,
      label: t("dashboard.home.sidebar.opportunities"),
      roles: [UserRole.VOLUNTEER, UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.organizations(language),
      Icon: BuildingsIcon,
      label: t("dashboard.home.sidebar.organizations"),
      roles: [UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.discussions(language),
      Icon: ChatsCircleIcon,
      label: t("dashboard.home.sidebar.discussions"),
      roles: [UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.calendar(language),
      Icon: CalendarDotsIcon,
      label: t("dashboard.home.sidebar.calendar"),
      roles: [UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.account(language),
      Icon: UserCircleIcon,
      label: t("dashboard.home.sidebar.account"),
      roles: [UserRole.VOLUNTEER, UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
  ];

  if (!user) return;
  const roleLinks = links.filter(({ roles }) => roles.includes(user.role));
  const MAX_MOBILE_ITEMS = 5;
  const mainLinks = roleLinks.length > MAX_MOBILE_ITEMS ? roleLinks.slice(0, MAX_MOBILE_ITEMS - 1) : roleLinks;
  const moreLinks = roleLinks.length > MAX_MOBILE_ITEMS ? roleLinks.slice(MAX_MOBILE_ITEMS - 1) : [];

  return (
    <Background $breakpoint={breakpoint} area-label="Main Navigation">
      <List $breakpoint={breakpoint}>
        {mainLinks.map(({ route, Icon, label }) => (
          <ListItem key={route}>
            <Link href={route} $selected={pathname.startsWith(route)} $breakpoint={breakpoint}>
              <Icon />
              {label}
              {route === routes.dashboard(language) && <NotificationBadge breakpoint={breakpoint} />}
            </Link>
          </ListItem>
        ))}
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
  padding: var(--large-spacing);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    padding: 0;
  }
`;

const List = styled.ul<{ $breakpoint: number }>`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: var(--small-spacing);
  }
`;

const ListItem = styled.li`
  flex: 1;
  height: 100%;
`;

const Link = styled(NextLink)<{ $selected: boolean; $breakpoint: number }>`
  display: -webkit-inline-flex;
  display: inline-flex;
  align-items: center;
  position: relative;
  gap: var(--small-spacing);
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: ${({ $selected }) => ($selected ? "var(--blue-100) !important" : "transparent")};
  border-radius: var(--field-border-radius);
  font-weight: var(--bold);
  color: var(--white);
  white-space: nowrap;
  transition: color var(--short-transition);

  &:hover,
  &:active,
  &:focus {
    background-color: var(--blue-80);
  }

  svg {
    width: var(--field-icon-size);
    height: var(--field-icon-size);
    fill: var(--white);
    transition: fill var(--short-transition);
  }

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex-direction: column;
    justify-content: center;
    gap: var(--very-small-spacing);
    padding: var(--small-spacing);
    width: 100%;
    height: 100%;
    font-family: var(--condensed-sans-serif);
    font-size: var(--mobile-menu-font-size);
    text-transform: uppercase;

    > svg {
      width: var(--mobile-menu-icon-size);
      height: var(--mobile-menu-icon-size);
    }
  }
`;
