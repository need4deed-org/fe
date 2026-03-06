import { MapPinIcon, PencilSimpleIcon, ShootingStarIcon, TranslateIcon } from "@phosphor-icons/react";
import { Lang, OpportunityType, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Tags } from "@/components/core/common";
import { Paragraph } from "@/components/styled/text";

import { StatusAccordionActions } from "../shared/AccordionActions";
import { DetailContainer, SplitContainer } from "../shared/accordionStyles";
import { InfoSection } from "../shared/InfoSection";
import { Opportunity } from "./mockOpps/tempTypes";
import { formatAccompanyingDate } from "./mockOpps/tempUtils";

type Props = {
  opportunity: Opportunity;
  currentStatus: OpportunityVolunteerStatusType;
  onMatch: () => void;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

export default function OpportunityDetail({
  opportunity,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) {
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
    <DetailContainer>
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
                {opportunityType === OpportunityType.REGULAR
                  ? t("dashboard.opportunities.mainCommunication")
                  : t("dashboard.opportunities.translationTo")}
                :
              </Paragraph>
              <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
                {opportunityType === OpportunityType.REGULAR ? defaultMainCommunication : accompanyingTranslation}
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
      <StatusAccordionActions
        currentStatus={currentStatus}
        onMatch={onMatch}
        onNotAMatch={onNotAMatch}
        onMarkAsActive={onMarkAsActive}
        onMarkAsPast={onMarkAsPast}
      />
    </DetailContainer>
  );
}

/* Styled Components */

const LanguagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-languages-gap);
`;

const LanguageRow = styled.div`
  display: flex;
  gap: var(--volunteer-profile-opportunities-accordion-language-row-gap);
`;
