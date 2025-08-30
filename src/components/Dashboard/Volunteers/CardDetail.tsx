import { ReactNode } from "react";
import styled from "styled-components";
import { CardParagraph } from "./VolunteerCard";
import { IconDiv } from "@/components/styled/container";
import { IconName, iconNameMap } from "./icon";

interface Props {
  header: string;
  children: ReactNode;
  iconName: IconName;
}

const CardDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-card-detail-gap);
`;

const CardDetailHeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dashboard-volunteers-card-detail-gap);
`;

export default function CardDetail({ header, children, iconName }: Props) {
  return (
    <CardDetailContainer>
      <CardDetailHeaderDiv>
        <IconDiv size="20px">{iconNameMap[iconName]}</IconDiv>
        <CardParagraph text={header + ":"} isBold />
      </CardDetailHeaderDiv>

      {children}
    </CardDetailContainer>
  );
}
