import styled from "styled-components";
import { IconLink } from "@/types/Link";
import { UserRole } from "need4deed-sdk";
import { routes } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import {
  BuildingsIcon,
  CalendarDotIcon,
  HandHeartIcon,
  NotepadIcon,
  SquaresFourIcon,
  UsersThreeIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

type MenuLink = IconLink & {
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
      roles: [UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.posts(language),
      Icon: NotepadIcon,
      label: t("dashboard.home.sidebar.posts"),
      roles: [UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.calendar(language),
      Icon: CalendarDotIcon,
      label: t("dashboard.home.sidebar.calendar"),
      roles: [UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
    {
      route: routes.profile(language),
      Icon: UserCircleIcon,
      label: t("dashboard.home.sidebar.profile"),
      roles: [UserRole.VOLUNTEER, UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
    },
  ];

  if (!user) return;

  return (
    <Background $breakpoint={breakpoint} area-label="Main Navigation">
      <List $breakpoint={breakpoint}>
        {links
          .filter(({ roles }) => roles.includes(user.role))
          .map(({ route, Icon, label }) => (
            <ListItem key={route}>
              <Link href={route} $selected={pathname.startsWith(route)} $breakpoint={breakpoint}>
                <Icon />
                <Label $breakpoint={breakpoint}>{label}</Label>
              </Link>
            </ListItem>
          ))}
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
    padding-left: var(--small-spacing);
    padding-right: var(--small-spacing);
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
  gap: var(--small-spacing);
  height: var(--field-size);
  padding-left: var(--large-spacing);
  padding-right: var(--large-spacing);
  background-color: ${({ $selected }) => ($selected ? "var(--blue-100) !important" : "transparent")};
  border-radius: var(--field-border-radius);
  color: var(--white);
  transition: var(--short-transition);

  &:hover,
  &:active,
  &:focus {
    background-color: var(--blue-75);
  }

  svg {
    width: var(--field-icon-size);
    height: var(--field-icon-size);
    fill: var(--white);
    transition: var(--short-transition);
  }

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    flex-direction: column;
    justify-content: center;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: transparent !important;

    svg {
      fill: ${({ $selected }) => ($selected ? "var(--blue-100) !important" : "var(--white)")};
    }

    &:hover > svg,
    &:active > svg,
    &:focus > svg {
      fill: var(--blue-75);
    }
  }
`;

const Label = styled.span<{ $breakpoint: number }>`
  font-weight: var(--bold);
  color: var(--white);
  white-space: nowrap;
  transition: color var(--short-transition);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    display: none;
  }
`;
