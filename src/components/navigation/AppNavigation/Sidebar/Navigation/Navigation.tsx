import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MoreButton } from "./MoreButton";
import { MainLinkButton } from "./MainLinkButton";
import { useAppNavigation } from "@/hooks/useAppNavigation";

type NavigationProps = {
  breakpoint: number;
};

export const Navigation = ({ breakpoint }: NavigationProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const user = useCurrentUser();
  const { main, lists } = useAppNavigation({ t, language, user });
  const MAX_MOBILE_ITEMS = 5;
  const MAX_MAIN_LINKS = MAX_MOBILE_ITEMS - 1; // Remove 1 to make room for the more button
  const barItems = main.length > MAX_MAIN_LINKS ? main.slice(0, MAX_MAIN_LINKS) : main;
  const menuItems = main.length > MAX_MAIN_LINKS ? main.slice(MAX_MAIN_LINKS) : [];

  return (
    <Background $breakpoint={breakpoint} aria-label={t("website.header.mainNavigation")}>
      <List $breakpoint={breakpoint}>
        {barItems.map(({ route, Icon, label, Badge }) => {
          return (
            <ListItem key={route} $breakpoint={breakpoint}>
              <MainLinkButton href={route} breakpoint={breakpoint} Icon={Icon} label={label} Badge={Badge} />
            </ListItem>
          );
        })}
        <MoreButton breakpoint={breakpoint} links={menuItems} lists={lists} />
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
