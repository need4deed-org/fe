import { Icon, MapPinIcon, ShootingStarIcon, TranslateIcon, CalendarDotsIcon } from "@phosphor-icons/react";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/core/button";
import { Tags } from "@/components/core/common";
import { IconDiv } from "@/components/styled/container";
import { Paragraph } from "@/components/styled/text";
import { Actions, Container, DetailHeader, DetailSection, LanguageRow, LanguagesList, SplitContainer } from "./styles";

interface Props {
  volunteer: ApiVolunteerGetList;
}

export const VolunteerDetail = ({ volunteer }: Props) => {
  const { t } = useTranslation();

  const { languages, locations, activities, availability, skills } = volunteer;

  const languagesText = languages.map((lan) => lan.title).join(", ");
  const district = locations.join(", ");
  const activity = activities.map((act) => act.title);
  const skill = skills.map((skill) => skill.title);
  return (
    <Container>
      {/* 2. Languages & Activities */}
      <SplitContainer>
        <InfoSection icon={TranslateIcon} title={t("dashboard.volunteerProfile.profileSection.languages")}>
          <LanguagesList>
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

        <InfoSection icon={ShootingStarIcon} title={t("dashboard.volunteerProfile.profileSection.activities")}>
          <Tags tags={activity} />
        </InfoSection>

        <InfoSection icon={ShootingStarIcon} title={t("dashboard.volunteerProfile.profileSection.skills")}>
          <Tags tags={skill} />
        </InfoSection>
      </SplitContainer>

      {/* 3. Location & Schedule */}
      <SplitContainer>
        <InfoSection icon={MapPinIcon} title={t("dashboard.volunteerProfile.profileSection.districts")}>
          <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
            {district}
          </Paragraph>
        </InfoSection>

        <InfoSection icon={CalendarDotsIcon} title={t("dashboard.volunteerProfile.profileSection.availability")}>
          <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
            {availability?.map(
              (date) => `${t(`dashboard.volunteers.filters.preferredAv.days.${[date.day]}`)} ${date.daytime}`,
            )}
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
};

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
