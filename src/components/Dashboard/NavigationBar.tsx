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
import { useState } from "react";

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: var(--dashboard-home-bar-container-width);
  left: 0;
  z-index: 1;
  gap: var(--dashboard-home-bar-gap);
  background-color: var(--color-orchid-subtle);
  border-top-right-radius: var(--dashboard-home-bar-border-radius);
  border-bottom-right-radius: var(--dashboard-home-bar-border-radius);
  padding: var(--dashboard-home-bar-padding);
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--dashboard-home-bar-option-gap);
  cursor: pointer;
`;

interface IconDivProps {
  $isSelected: boolean;
}

const IconDiv = styled.div<IconDivProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--dashboard-home-bar-option-icon-div-size);
  height: var(--dashboard-home-bar-option-icon-div-size);
  border-radius: var(--dashboard-home-bar-option-icon-div-size);

  background-color: var(--color-orchid);
  margin: auto;

  background-color: ${({ $isSelected }) => ($isSelected ? "var(--color-midnight)" : "var(--color-orchid)")};
`;

interface StyledParagraphProps {
  label: string;
  isSelected?: boolean;
}

const StyledParagraph = ({ label, isSelected }: StyledParagraphProps) => {
  return (
    <Paragraph
      color={isSelected ? "var(--color-orchid)" : "var(--color-midnight)"}
      fontSize={"14px"}
      fontWeight={500}
      letterSpacing="0.14px"
      lineheight="14px"
      margin="auto"
    >
      {label}
    </Paragraph>
  );
};

export default function NavigationBar() {
  const { t } = useTranslation();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const options = [
    { label: t("dashboard.home.sidebar.home"), Icon: HouseIcon },
    { label: t("dashboard.home.sidebar.volunteers"), Icon: UserCheckIcon },
    {
      label: t("dashboard.home.sidebar.opportunities"),
      Icon: ShootingStarIcon,
    },
    {
      label: t("dashboard.home.sidebar.racs"),
      Icon: BookOpenTextIcon,
    },
    {
      label: t("dashboard.home.sidebar.posts"),
      Icon: NotepadIcon,
    },
    {
      label: t("dashboard.home.sidebar.calendar"),
      Icon: CalendarDotsIcon,
    },
    {
      label: t("dashboard.home.sidebar.profile"),
      text: "OA", // TODO; after user login enabled, use user info in here !
    },
  ];

  return (
    <BarContainer>
      {options.map(({ label, Icon, text }, index) => {
        const isSelected = index === selectedOptionIndex;
        return (
          <Option key={label} onClick={() => setSelectedOptionIndex(index)}>
            <IconDiv $isSelected={isSelected}>
              {(Icon && <Icon size={24} color={isSelected ? "var(--color-orchid)" : "var(--color-midnight)"} />) ||
                (text && <StyledParagraph isSelected={isSelected} label={text} />)}
            </IconDiv>

            <StyledParagraph label={label} />
          </Option>
        );
      })}
    </BarContainer>
  );
}
