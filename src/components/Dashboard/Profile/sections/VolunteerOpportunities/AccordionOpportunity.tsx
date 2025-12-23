import { useState } from "react";
import styled from "styled-components";
import { Heading4, Paragraph } from "@/components/styled/text";
import CircleArrow from "@/components/svg/CircleArrow";
import { Opportunity } from "./mockOpps/tempTypes";

interface Props {
  opportunity: Opportunity;
}

export default function AccordionOpportunity({ opportunity }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  console.log("* inside AccordionOpp:", opportunity);

  return (
    <AccordionContainer>
      <HeaderContainer>
        <HeaderInfoContainer>
          <HeaderInfoAvatarNameContainer>
            <Paragraph>ICON</Paragraph>
            <Heading4 color="var(--color-midnight)">Name of the opportunity</Heading4>
            <Paragraph>Matched</Paragraph>
          </HeaderInfoAvatarNameContainer>
          <Paragraph>Matched on 12.02.2025</Paragraph>
        </HeaderInfoContainer>

        <HeaderButtonsContainer>
          <Paragraph>Go to Profile</Paragraph>
          <CircleArrow direction={isOpen ? "up" : "down"} color="orchid" isFilled onClick={() => setIsOpen(!isOpen)} />
        </HeaderButtonsContainer>
      </HeaderContainer>

      {isOpen && <DetailContainer>Opportinity Detail Container</DetailContainer>}
    </AccordionContainer>
  );
}

/* Styles */

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--color-blue-50);
  background: var(--color-white);

  gap: 24px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const HeaderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const HeaderInfoAvatarNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

const HeaderButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  gap: var(--opportunities-filters-content-accordion-options-gap);
  max-height: var(--opportunities-filters-content-accordion-options-max-height);
  overflow-y: auto;
`;
