"use client";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IconLink } from "@/types/Link";
import { Icon, UserCircleIcon, SignOutIcon } from "@phosphor-icons/react";
import { ROUTES } from "@/constants/routes";
import { MenuLinkButton } from "./MenuLinkButton";
import { MenuButton } from "./MenuButton";
import { useLogout } from "@/hooks/useLogout";

type LinkButtonItem = IconLink & {
  type: "link";
};

type ButtonItem = {
  type: "button";
  Icon: Icon;
  label: string;
  onClick: () => void;
};

type Item = LinkButtonItem | ButtonItem;

type UserMenuProps = {
  breakpoint: number;
};

export const UserMenu = ({ breakpoint }: UserMenuProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { mutate: logout } = useLogout();
  const items: Item[] = [
    {
      type: "link",
      route: ROUTES.account(language),
      Icon: UserCircleIcon,
      label: t("dashboard.home.sidebar.account"),
    },
    {
      type: "button",
      Icon: SignOutIcon,
      label: t("dashboard.home.sidebar.logout"),
      onClick: logout,
    },
  ];
  return (
    <Background $breakpoint={breakpoint}>
      <List>
        {items.map((item, i) => (
          <ListItem key={i}>
            {item.type === "link" ? (
              <MenuLinkButton href={item.route} Icon={item.Icon} label={item.label} />
            ) : (
              <MenuButton Icon={item.Icon} label={item.label} onClick={item.onClick} />
            )}
          </ListItem>
        ))}
      </List>
    </Background>
  );
};

const Background = styled.div<{ $breakpoint: number }>`
  padding: var(--medium-spacing);
  border-top: var(--border-width) solid var(--lavender-40);

  @media screen and (max-width: ${({ $breakpoint }) => $breakpoint}px) {
    padding: var(--medium-spacing);
  }
`;

const List = styled.ul`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);
`;

const ListItem = styled.li`
  flex: 1;
  width: 100%;
`;
