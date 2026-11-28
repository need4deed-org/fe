"use client";
import styled from "styled-components";
import NextLink from "next/link";
import { IconLink } from "@/types/Link";
import { InstagramLogoIcon, FacebookLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import { SOCIALS } from "@/constants/socials";

type SocialLink = IconLink & {
  iconWeight: "bold" | "fill";
};

export const Socials = () => {
  const links: SocialLink[] = [
    { route: SOCIALS.instagram, label: "Instagram", Icon: InstagramLogoIcon, iconWeight: "bold" },
    { route: SOCIALS.facebook, label: "Facebook", Icon: FacebookLogoIcon, iconWeight: "fill" },
    { route: SOCIALS.linkedin, label: "LinkedIn", Icon: LinkedinLogoIcon, iconWeight: "fill" },
  ];

  return (
    <List>
      {links.map(({ route, label, Icon, iconWeight }) => (
        <ListItem key={route}>
          <Link href={route} target="_blank" aria-label={label}>
            {<Icon weight={iconWeight} />}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

const List = styled.ul`
  display: -webkit-flex;
  display: flex;
  gap: var(--medium-spacing);
  grid-area: socials;
`;

const ListItem = styled.li``;

const Link = styled(NextLink)`
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--field-size);
  height: var(--field-size);

  > svg {
    width: 100%;
    height: 100%;
    fill: var(--misty-lavender);
  }
`;
