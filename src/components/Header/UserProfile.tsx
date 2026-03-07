import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { useState } from "react";
import styled from "styled-components";
import { Paragraph } from "../styled/text";

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
  const [isCaretDown, setIsCaretDown] = useState(true);
  const user = useCurrentUser();
  const userName = getInitials(user?.fullName) || user?.firstName?.[0]?.toUpperCase() || "";

  return (
    <UserProfileContainer onClick={() => setIsCaretDown(!isCaretDown)}>
      <UserIconDiv>
        <Paragraph color="var(--color-white)" fontWeight={400} fontSize="14px" lineheight="18px" letterSpacing="0.2px">
          {userName}
        </Paragraph>
      </UserIconDiv>
      {isCaretDown ? (
        <CaretDownIcon size={20} color={"var(--color-midnight)"} />
      ) : (
        <CaretUpIcon size={20} color={"var(--color-midnight)"} />
      )}
    </UserProfileContainer>
  );
}

export default UserProfile;
