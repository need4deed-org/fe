"use client";
import styled from "styled-components";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import { IconLink } from "@/types/Link";
import { MenuLinkButton } from "./MenuLinkButton";
import { HandshakeIcon, GavelIcon, LockKeyIcon } from "@phosphor-icons/react";

type LegalLinksProps = {
  breakpoint: number;
};

export const LegalLinks = ({ breakpoint }: LegalLinksProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const links: IconLink[] = [
    { route: ROUTES.legal(language), Icon: GavelIcon, label: t("dashboard.home.sidebar.legal") },
    { route: ROUTES.privacy(language), Icon: LockKeyIcon, label: t("dashboard.home.sidebar.privacy") },
    { route: ROUTES.agreement(language), Icon: HandshakeIcon, label: t("dashboard.home.sidebar.agreement") },
  ];

  return (
    <Background $breakpoint={breakpoint}>
      <List>
        {links.map(({ route, Icon, label }) => (
          <ListItem key={route}>
            <MenuLinkButton href={route} Icon={Icon} label={label} />
          </ListItem>
        ))}
      </List>
    </Background>
  );
};

const Background = styled.div<{ $breakpoint: number }>`
  padding: var(--medium-spacing);
  border-top: var(--border-width) solid var(--pale-lavender);

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
