import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ListIcon } from "@phosphor-icons/react";

import BurgerMenuItems from "./BurgerMenuItems";
import MenuItems from "./MenuItems";
import { MenuItemType, Subpage } from "@/types";
import { eventsSectionContainerId } from "@/config/constants";
import LoginRegister from "./LoginRegister";
// import UserProfile from "./UserProfile";

interface HeaderContainerProps {
  height?: string;
  padding?: string;
}

const HeaderContainer = styled.div<HeaderContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${(props) => props.height || "auto"};
  padding: ${(props) => props.padding};
  position: fixed;
  z-index: 1;
  top: 0;
  background-color: var(--color-orchid-subtle);
  width: -webkit-fill-available;
`;

interface Props {
  logo: ReactNode;
  isBurgerMenu?: boolean;
  height?: string;
  padding?: string;
  menuItemColor: string;
  burgerMenuItemColor?: string;
}

export function Header({
  logo,
  isBurgerMenu,
  height,
  padding,
  menuItemColor,
  burgerMenuItemColor = "var(--color-midnight)",
}: Props) {
  const { t } = useTranslation();
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState<boolean>(false);

  const menuItems: MenuItemType[] = [
    [t("homepage.heroSection.menuItems.about"), `/${Subpage.ABOUT}`],
    [t("homepage.heroSection.menuItems.volunteeringOpportunities"), `/${Subpage.OPPORTUNITY_CARDS}`],
    [t("homepage.heroSection.menuItems.events"), `/#${eventsSectionContainerId}`],
  ];

  return (
    <HeaderContainer id="header-container" height={height} padding={padding}>
      {logo}

      {isBurgerMenu ? (
        <>
          <ListIcon size={32} color={menuItemColor} onClick={() => setIsBurgerMenuOpen(true)} />
          {isBurgerMenuOpen && (
            <BurgerMenuItems
              isOpen={isBurgerMenuOpen}
              setIsOpen={setIsBurgerMenuOpen}
              items={menuItems}
              menuItemColor={burgerMenuItemColor}
            />
          )}
        </>
      ) : (
        <MenuItems items={menuItems} menuItemColor={menuItemColor} />
      )}

      <LoginRegister />
      {/* TODO: add this after user login state implemented */}
      {/* <UserProfile /> */}
    </HeaderContainer>
  );
}

export default Header;
