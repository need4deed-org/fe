import styled from "styled-components";
import { Paragraph } from "../styled/text";

import {
  BookOpenTextIcon,
  CalendarDotsIcon,
  HouseIcon,
  NotepadIcon,
  ShootingStarIcon,
  UserCheckIcon,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 110px;
  left: 0;
  z-index: 1;
  gap: 20px;

  background-color: var(--color-orchid-subtle);
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 40px 16px 40px 16px;
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
`;

export const IconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  border-radius: 40px;

  background-color: var(--color-orchid);
  margin: auto;
`;

export default function NavigationBar() {
  const { t } = useTranslation();

  const options = [
    { label: t("dashboard.home.sidebar.home"), icon: <HouseIcon size={24} color="var(--color-midnight)" /> },
    { label: t("dashboard.home.sidebar.volunteers"), icon: <UserCheckIcon size={24} color="var(--color-midnight)" /> },
    {
      label: t("dashboard.home.sidebar.opportunities"),
      icon: <ShootingStarIcon size={24} color="var(--color-midnight)" />,
    },
    {
      label: t("dashboard.home.sidebar.racs"),
      icon: <BookOpenTextIcon size={24} color="var(--color-midnight)" />,
    },
    {
      label: t("dashboard.home.sidebar.posts"),
      icon: <NotepadIcon size={24} color="var(--color-midnight)" />,
    },
    {
      label: t("dashboard.home.sidebar.calendar"),
      icon: <CalendarDotsIcon size={24} color="var(--color-midnight)" />,
    },
    {
      label: t("dashboard.home.sidebar.profile"),
      text: "OA", // TODO; after login, use user name if here
    },
  ];

  return (
    <BarContainer>
      {options.map(({ label, icon, text }) => (
        <Option key={label}>
          <IconDiv>{icon || text}</IconDiv>
          <Paragraph
            color={"var(--color-midnight)"}
            fontSize={"14px"}
            fontWeight={500}
            letterSpacing="0.14px"
            lineheight="14px"
            margin="auto"
          >
            {label}
          </Paragraph>
        </Option>
      ))}
    </BarContainer>
  );
}
