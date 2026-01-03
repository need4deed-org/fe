import { Paragraph } from "@/components/styled/text";
import React from "react";
import styled from "styled-components";
import { Opportunity } from "./mockOpps/tempTypes";
import { MapPinIcon, PencilSimpleIcon, ShootingStarIcon, TranslateIcon } from "@phosphor-icons/react";
import { IconDiv } from "@/components/styled/container";
import { Lang, OpportunityType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { Tags } from "@/components/core/common";
import { formatAccompanyingDate } from "./mockOpps/tempUtils";

interface Props {
  opportunity: Opportunity;
}

export default function OpportunityDetail({ opportunity }: Props) {
  const { t, i18n } = useTranslation();
  const language = i18n.language as Lang;

  const {
    voInformation,
    opportunityType,
    defaultMainCommunication,
    accompanyingTranslation,
    languages,
    locations,
    activities,
    accompanyingDate,
    schedule,
  } = opportunity;

  const languagesText = languages.join(", ");
  const district = locations.join(", ");
  const scheduleAsStr = (accompanyingDate && formatAccompanyingDate(accompanyingDate, language)) || schedule || "";

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

      <SplitContainer>
        <DetailSection>
          <DetailHeader>
            <IconDiv size="20px">
              <TranslateIcon />
            </IconDiv>
            <Paragraph fontWeight={550}>{t(`dashboard.opportunities.languages`)}</Paragraph>
          </DetailHeader>
          <LanguagesContainer>
            {opportunityType === OpportunityType.GENERAL ? (
              <LanguageDetailContainer>
                <Paragraph fontWeight={550}>{t("dashboard.opportunities.mainCommunication")}:</Paragraph>
                <Paragraph>{defaultMainCommunication}</Paragraph>
              </LanguageDetailContainer>
            ) : (
              <LanguageDetailContainer>
                <Paragraph fontWeight={550}>{t("dashboard.opportunities.translationTo")}:</Paragraph>
                <Paragraph>{accompanyingTranslation}</Paragraph>
              </LanguageDetailContainer>
            )}

            <LanguageDetailContainer>
              <Paragraph $textWrap="nowrap" fontWeight={550}>
                {t("dashboard.opportunities.residentsSpeak")}:
              </Paragraph>
              <Paragraph>{languagesText}</Paragraph>
            </LanguageDetailContainer>
          </LanguagesContainer>
        </DetailSection>

        <DetailSection>
          <DetailHeader>
            <IconDiv size="20px">
              <ShootingStarIcon />
            </IconDiv>
            <Paragraph fontWeight={550}>{t(`dashboard.volunteerProfile.activities`)}</Paragraph>
          </DetailHeader>

          <Tags tags={activities} />
        </DetailSection>
      </SplitContainer>

      <SplitContainer>
        <DetailSection>
          <DetailHeader>
            <IconDiv size="20px">
              <MapPinIcon weight="fill" />
            </IconDiv>
            <Paragraph fontWeight={550}>{t(`dashboard.opportunities.district`)}</Paragraph>
          </DetailHeader>
          <Paragraph>{district}</Paragraph>
        </DetailSection>

        <DetailSection>
          <DetailHeader>
            <IconDiv size="20px">
              <MapPinIcon weight="fill" />
            </IconDiv>
            <Paragraph fontWeight={550}>
              {accompanyingDate
                ? t(`dashboard.opportunities.dateOfAppointment`)
                : t(`dashboard.opportunities.schedule`)}
            </Paragraph>
          </DetailHeader>
          <Paragraph>{scheduleAsStr}</Paragraph>
        </DetailSection>
      </SplitContainer>
    </OpportunityDetailContainer>
  );
}

/* Styles */

const OpportunityDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--volunteer-profile-opportunities-accordion-container-gap);
`;

const SplitContainer = styled.div`
  display: flex;
  gap: 24px;
`;

const Pane = styled.div`
  flex: 1;
`;

const DetailSection = styled(Pane)`
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
  gap: 4px;
`;
