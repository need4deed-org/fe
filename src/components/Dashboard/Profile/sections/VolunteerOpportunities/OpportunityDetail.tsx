import { Paragraph } from "@/components/styled/text";
import React from "react";
import styled from "styled-components";
import { Opportunity } from "./mockOpps/tempTypes";
import { PencilSimpleIcon, TranslateIcon } from "@phosphor-icons/react";
import { IconDiv } from "@/components/styled/container";
import { OpportunityType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

interface Props {
  opportunity: Opportunity;
}

export default function OpportunityDetail({ opportunity }: Props) {
  const { t } = useTranslation();

  const { voInformation, opportunityType, defaultMainCommunication, accompanyingTranslation, languages } = opportunity;

  const languagesText = languages.join(", ");

  return (
    <OpportunityDetailContainer>
      <DetailSection>
        <DetailHeader>
          <IconDiv size="20px">
            <PencilSimpleIcon />
          </IconDiv>
          <Paragraph fontWeight={550}>Description</Paragraph>
        </DetailHeader>
        {voInformation}
      </DetailSection>

      <DetailSection>
        <DetailHeader>
          <IconDiv size="20px">
            <TranslateIcon />
          </IconDiv>
          <Paragraph fontWeight={550}>Languages</Paragraph>
        </DetailHeader>

        <LanguagesContainer>
          {opportunityType === OpportunityType.GENERAL ? (
            <LanguageDetailContainer>
              <Paragraph fontWeight={400}>{t("homepage.volunteeringOpportunities.mainCommunication")}:</Paragraph>
              <Paragraph>{defaultMainCommunication}</Paragraph>
            </LanguageDetailContainer>
          ) : (
            <LanguageDetailContainer>
              <Paragraph fontWeight={400}>{t("homepage.volunteeringOpportunities.translationTo")}:</Paragraph>
              <Paragraph>{accompanyingTranslation}</Paragraph>
            </LanguageDetailContainer>
          )}

          <LanguageDetailContainer>
            <Paragraph fontWeight={400}>{t("homepage.volunteeringOpportunities.residentsSpeak")}:</Paragraph>
            <Paragraph>{languagesText}</Paragraph>
          </LanguageDetailContainer>
        </LanguagesContainer>
      </DetailSection>
    </OpportunityDetailContainer>
  );
}

/* Styles */

const OpportunityDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* justify-content: left; */
  gap: var(--volunteer-profile-opportunities-accordion-container-gap);

  /* max-height: var(--opportunities-filters-content-accordion-options-max-height); */
  /* overflow-y: auto; */
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  gap: 8px;
`;

const DetailHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  gap: 8px;
`;

const LanguagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-languages-gap);
`;

const LanguageDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-languages-gap);
`;
