import { ReactNode } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon, MapPinIcon, PencilSimpleIcon, ShootingStarIcon, TranslateIcon } from "@phosphor-icons/react";
import { Lang, OpportunityType } from "need4deed-sdk";

import { Paragraph } from "@/components/styled/text";
import { IconDiv } from "@/components/styled/container";
import { Tags } from "@/components/core/common";
import { Button } from "@/components/core/button";

import { Opportunity } from "./mockOpps/tempTypes";
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
    <Container>
      {/* 1. Description */}
      <InfoSection icon={PencilSimpleIcon} title={t("dashboard.opportunities.description")}>
        <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
          {voInformation}
        </Paragraph>
      </InfoSection>

      {/* 2. Languages & Activities */}
      <SplitContainer>
        <InfoSection icon={TranslateIcon} title={t("dashboard.opportunities.languages")}>
          <LanguagesList>
            <LanguageRow>
              <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-bold-font)">
                {opportunityType === OpportunityType.GENERAL
                  ? t("dashboard.opportunities.mainCommunication")
                  : t("dashboard.opportunities.translationTo")}
                :
              </Paragraph>
              <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
                {opportunityType === OpportunityType.GENERAL ? defaultMainCommunication : accompanyingTranslation}
              </Paragraph>
            </LanguageRow>

            <LanguageRow>
              <Paragraph
                $textWrap="nowrap"
                fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-bold-font)"
              >
                {t("dashboard.opportunities.residentsSpeak")}:
              </Paragraph>
              <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
                {languagesText}
              </Paragraph>
            </LanguageRow>
          </LanguagesList>
        </InfoSection>

        <InfoSection icon={ShootingStarIcon} title={t("dashboard.volunteerProfile.activities")}>
          <Tags tags={activities} />
        </InfoSection>
      </SplitContainer>

      {/* 3. Location & Schedule */}
      <SplitContainer>
        <InfoSection icon={MapPinIcon} title={t("dashboard.opportunities.district")}>
          <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
            {district}
          </Paragraph>
        </InfoSection>

        <InfoSection
          icon={MapPinIcon}
          title={
            accompanyingDate ? t("dashboard.opportunities.dateOfAppointment") : t("dashboard.opportunities.schedule")
          }
        >
          <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
            {scheduleAsStr}
          </Paragraph>
        </InfoSection>
      </SplitContainer>

      {/* 4. Action Buttons */}
      <Actions>
        <Button
          onClick={() => {}}
          text={t("dashboard.volunteerProfile.opportunitiesSec.notAMatch")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
          textColor="var(--color-aubergine)"
          backgroundcolor="var(--color-white)"
          border="var(--volunteer-profile-opportunities-accordion-actions-button-border)"
        />
        <Button
          onClick={() => {}}
          text={t("dashboard.volunteerProfile.opportunitiesSec.match")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
        />
      </Actions>
    </Container>
  );
}

/* Helper Components */

interface InfoSectionProps {
  icon: Icon;
  title: string;
  children: ReactNode;
}
const InfoSection = ({ icon: Icon, title, children }: InfoSectionProps) => (
  <DetailSection>
    <DetailHeader>
      <IconDiv size="var(--volunteer-profile-opportunities-accordion-info-section-icon-size)">
        <Icon weight={Icon === MapPinIcon ? "fill" : "regular"} />
      </IconDiv>
      <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-mid-font)">{title}</Paragraph>
    </DetailHeader>

    {children}
  </DetailSection>
);

/* Styled Components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--volunteer-profile-opportunities-accordion-container-gap);
`;

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--volunteer-profile-opportunities-accordion-split-container-gap);
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-accordion-detail-section-gap);
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-detail-header-gap);
`;

const LanguagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-languages-gap);
`;

const LanguageRow = styled.div`
  display: flex;
  gap: var(--volunteer-profile-opportunities-accordion-language-row-gap);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--volunteer-profile-opportunities-accordion-actions-container-gap);
  justify-content: center;
`;
