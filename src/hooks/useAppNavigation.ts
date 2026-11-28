"use client";
import { TFunction } from "i18next";
import { ApiUserGet } from "need4deed-sdk";
import { useMemo, ComponentType } from "react";
import { IconLink } from "@/types/Link";
import { UserRole } from "need4deed-sdk";
import { ROUTES } from "@/constants/routes";
import {
  BuildingsIcon,
  CalendarDotsIcon,
  ChatsCircleIcon,
  HandHeartIcon,
  Icon,
  SquaresFourIcon,
  UsersThreeIcon,
  UserCircleIcon,
  SignOutIcon,
  GavelIcon,
  LockKeyIcon,
  HandshakeIcon,
} from "@phosphor-icons/react";
import { NotificationBadge } from "@/components/navigation/AppNavigation/Sidebar/Navigation/NotificationBadge";
import { useLogout } from "./useLogout";

type Props = {
  t: TFunction;
  language: string;
  user?: ApiUserGet;
};

export type MainItem = IconLink & {
  type: "link";
  roles: UserRole[];
  Badge?: ComponentType;
};

type ListLink = IconLink & {
  type: "link";
};

type ListButton = {
  type: "button";
  Icon: Icon;
  label: string;
  onClick: () => void;
};

type ListItem = ListLink | ListButton;

export type List = ListItem[];

type Items = {
  main: MainItem[];
  lists: List[];
};

export const useAppNavigation = ({ t, language, user }: Props): Items => {
  const { mutate: logout } = useLogout();
  return useMemo(() => {
    if (!user) return { main: [], lists: [] };
    const mainItems: MainItem[] = [
      {
        type: "link",
        route: ROUTES.dashboard(language),
        Icon: SquaresFourIcon,
        label: t("dashboard.home.sidebar.dashboard"),
        roles: [UserRole.VOLUNTEER, UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
        Badge: NotificationBadge,
      },
      {
        type: "link",
        route: ROUTES.volunteers(language),
        Icon: UsersThreeIcon,
        label: t("dashboard.home.sidebar.volunteers"),
        roles: [UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
      },
      {
        type: "link",
        route: ROUTES.opportunities(language),
        Icon: HandHeartIcon,
        label: t("dashboard.home.sidebar.opportunities"),
        roles: [UserRole.VOLUNTEER, UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
      },
      {
        type: "link",
        route: ROUTES.organizations(language),
        Icon: BuildingsIcon,
        label: t("dashboard.home.sidebar.organizations"),
        roles: [UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
      },
      {
        type: "link",
        route: ROUTES.discussions(language),
        Icon: ChatsCircleIcon,
        label: t("dashboard.home.sidebar.discussions"),
        roles: [UserRole.AGENT, UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
      },
      {
        type: "link",
        route: ROUTES.calendar(language),
        Icon: CalendarDotsIcon,
        label: t("dashboard.home.sidebar.calendar"),
        roles: [UserRole.USER, UserRole.COORDINATOR, UserRole.ADMIN],
      },
    ];
    const roleMainItems = mainItems.filter(({ roles }) => roles.includes(user.role));
    const lists: List[] = [
      [
        {
          type: "link",
          route: ROUTES.account(language),
          Icon: UserCircleIcon,
          label: t("dashboard.home.sidebar.account"),
        },
        { type: "button", Icon: SignOutIcon, label: t("dashboard.home.sidebar.logout"), onClick: logout },
      ],
      [
        { type: "link", route: ROUTES.legal(language), Icon: GavelIcon, label: t("dashboard.home.sidebar.legal") },
        {
          type: "link",
          route: ROUTES.privacy(language),
          Icon: LockKeyIcon,
          label: t("dashboard.home.sidebar.privacy"),
        },
        {
          type: "link",
          route: ROUTES.agreement(language),
          Icon: HandshakeIcon,
          label: t("dashboard.home.sidebar.agreement"),
        },
      ],
    ];
    return {
      main: roleMainItems,
      lists,
    };
  }, [user]);
};
