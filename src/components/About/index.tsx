"use client";
import styled from "styled-components";
import { PageLayout } from "../Layout";
import { useTranslation } from "react-i18next";

function AboutUs() {
  const { t } = useTranslation();
  const AboutUsContainer = styled.div`
    font-size: var(--font-size-xs);
    line-height: 2;
    margin: 0;
    margin-inline: auto;
    max-width: min(90vw, 1080px);
    padding: min(2vw, 40px);
    & h2,
    h6 {
      color: var(--color-neutral-200);
    }
  `;

  return (
    <PageLayout background="var(--color-orchid)">
      <AboutUsContainer>
        <h2>{t("aboutus.aboutusHeading")}</h2>
        <p>{t("aboutus.aboutusSubheading")}</p>

        <h2>{t("aboutus.values.valuesHeading")}</h2>

        <h6>{t("aboutus.values.equalOpportunityHeading")}</h6>
        <p>{t("aboutus.values.equalOpportunitySubheading")}</p>

        <h6>{t("aboutus.values.responsibilityHeading")}</h6>
        <p>{t("aboutus.values.responsibilitySubheading")}</p>

        <h6>{t("aboutus.values.migranToMigranSupportHeading")}</h6>
        <p>{t("aboutus.values.migranToMigranSupportSubheading")}</p>
        <h6>{t("aboutus.values.activeParticipationHeading")}</h6>
        <p>{t("aboutus.values.activeParticipationSubheading")}</p>

        <h6>{t("aboutus.values.technologyHeading")}</h6>
        <p>{t("aboutus.values.technologySubheading")}</p>
      </AboutUsContainer>
    </PageLayout>
  );
}

export default AboutUs;
