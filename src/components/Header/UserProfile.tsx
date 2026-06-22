"use client";
import { useClickOutside } from "@/hooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CaretDownIcon, CaretUpIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Paragraph } from "../styled/text";

const UserProfileWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dashboard-cards-header-user-profile-container-gap);
  cursor: pointer;
`;

const UserIconDiv = styled.div`
  display: flex;
  height: var(--dashboard-cards-header-user-icon-size);
  width: var(--dashboard-cards-header-user-icon-size);
  background-color: var(--color-midnight);
  justify-content: center;
  align-items: center;
  border-radius: var(--dashboard-cards-header-user-icon-border-radius);
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 100;
  margin: 0;
  padding: var(--spacing-8) 0;
  list-style: none;
  background: var(--color-white);
  border-radius: var(--border-radius-xs);
  box-shadow: var(--dropdown-box-shadow);
  min-width: 140px;
`;

const DropdownItem = styled.li`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-8) var(--spacing-16);
  font-size: var(--font-size-lg);
  color: var(--color-midnight);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const getInitials = (fullName: string | undefined): string => {
  if (!fullName) return "";
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useCurrentUser();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  useClickOutside(ref, () => setIsOpen(false));

  const userName = getInitials(user?.fullName) || user?.firstName?.[0]?.toUpperCase() || "";

  const handleLogout = () => {
    document.cookie = "is_logged_in=; path=/; max-age=0; SameSite=Lax; Secure";
    router.push(`/${i18n.language}/login`);
  };

  return (
    <UserProfileWrapper ref={ref}>
      <UserProfileContainer onClick={() => setIsOpen((prev) => !prev)}>
        <UserIconDiv>
          <Paragraph
            color="var(--color-white)"
            fontWeight={400}
            fontSize="14px"
            lineheight="18px"
            letterSpacing="0.2px"
          >
            {userName}
          </Paragraph>
        </UserIconDiv>
        {isOpen ? (
          <CaretUpIcon size={20} color={"var(--color-midnight)"} />
        ) : (
          <CaretDownIcon size={20} color={"var(--color-midnight)"} />
        )}
      </UserProfileContainer>

      {isOpen && (
        <DropdownMenu>
          <DropdownItem onClick={handleLogout}>
            <SignOutIcon size={18} />
            {t("dashboard.header.button.logout")}
          </DropdownItem>
        </DropdownMenu>
      )}
    </UserProfileWrapper>
  );
}

export default UserProfile;
