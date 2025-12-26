import { useState } from "react";
import styled from "styled-components";
import { Heading4, Paragraph } from "@/components/styled/text";
import { Opportunity } from "./mockOpps/tempTypes";
import { IconDiv } from "@/components/styled/container";
import { iconNameMap } from "../../common/icon";
import { CategoryTitle, getIconName } from "./mockOpps/tempUtils";
import StatusBadge from "../../common/StatusBadge";
import { VolunteerStateType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";

interface Props {
  opportunity: Opportunity;
}

export default function AccordionOpportunity({ opportunity }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { categoryId, title } = opportunity;
  const iconName = getIconName(categoryId as CategoryTitle);
  const CaretIcon = isOpen ? CaretUpIcon : CaretDownIcon;

  return (
    <AccordionContainer>
      <HeaderContainer>
        <HeaderInfoContainer>
          <HeaderInfoAvatarNameContainer>
            <IconDiv size="var(--volunteer-profile-section-card-icon-size)">{iconNameMap[iconName]}</IconDiv>
            <Heading4 margin={0} color="var(--color-midnight)">
              {title}
            </Heading4>
            {/* Todo: this will be updated later when opps fetched from API */}
            <StatusBadge status={VolunteerStateType.MATCHED} />
          </HeaderInfoAvatarNameContainer>
          {/* Todo: this will be updated later when opps fetched from API */}
          <Paragraph>Matched on 12.02.2025</Paragraph>
        </HeaderInfoContainer>

        <HeaderButtonsContainer>
          <Heading4 margin={0} color="var(--color-midnight-light)">
            {t("dashboard.opportunities.goToProfile")}
          </Heading4>
          <CaretIcon
            size={24}
            onClick={() => setIsOpen((prev) => !prev)}
            cursor="pointer"
            color="var(--color-midnight)"
          />
        </HeaderButtonsContainer>
      </HeaderContainer>

      {/* Todo: will be implemented in other Task */}
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
