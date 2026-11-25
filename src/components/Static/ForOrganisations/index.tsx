"use client";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/Layout";
import { CONTACT_EMAIL } from "@/config/constants";
import { Subpage } from "@/types";
import { Card, CardGrid } from "@/components/styled/card-grid";
import {
  Badge,
  Container,
  ContentSection,
  Heading,
  NoteText,
  QuestionRow,
  SectionBlock,
  SectionHeader,
  SubHeading,
  TextLink,
} from "../styled";

const STEPS = ["request", "search", "prepare", "match", "introduction", "noMatch", "afterMatch"];
const DASHBOARD_FEATURES = [
  "matched",
  "import",
  "link",
  "hours",
  "appreciation",
  "feedback",
  "export",
  "traeger",
  "efz",
  "posts",
  "openSource",
];

function ForOrganisations() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <PageLayout background="var(--color-magnolia)">
      <Container>
        <Heading>{t("forOrganisationsPage.heading")}</Heading>

        <ContentSection>
          <NoteText>{t("forOrganisationsPage.intro")}</NoteText>

          <SectionBlock>
            <SubHeading>{t("forOrganisationsPage.stepsHeading")}</SubHeading>
            <NoteText>{t("forOrganisationsPage.stepsIntro")}</NoteText>
            <CardGrid>
              {STEPS.map((step, index) => (
                <Card key={step}>
                  <QuestionRow>
                    <Badge>{index + 1}</Badge>
                    <SectionHeader>{t(`forOrganisationsPage.steps.${step}.title`)}</SectionHeader>
                  </QuestionRow>
                  <NoteText>{t(`forOrganisationsPage.steps.${step}.body`)}</NoteText>
                </Card>
              ))}
            </CardGrid>
          </SectionBlock>

          <SectionBlock>
            <SubHeading>{t("forOrganisationsPage.dashboard.heading")}</SubHeading>
            <NoteText>{t("forOrganisationsPage.dashboard.intro")}</NoteText>
            <CardGrid>
              {DASHBOARD_FEATURES.map((feature) => (
                <Card key={feature}>
                  <SectionHeader>{t(`forOrganisationsPage.dashboard.features.${feature}.title`)}</SectionHeader>
                  <NoteText>{t(`forOrganisationsPage.dashboard.features.${feature}.body`)}</NoteText>
                </Card>
              ))}
            </CardGrid>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("forOrganisationsPage.goodToKnow.heading")}</SectionHeader>
            <NoteText>{t("forOrganisationsPage.goodToKnow.free")}</NoteText>
            <NoteText>
              {t("forOrganisationsPage.goodToKnow.register")}{" "}
              <TextLink href={`/${lang}/register/agent`}>{t("forOrganisationsPage.goodToKnow.registerLink")}</TextLink>
            </NoteText>
            <NoteText>
              {t("forOrganisationsPage.goodToKnow.guidelines")}{" "}
              <TextLink href={`/${lang}/${Subpage.RAC_GUIDELINES}`}>
                {t("forOrganisationsPage.goodToKnow.guidelinesLink")}
              </TextLink>
            </NoteText>
            <NoteText>
              {t("forOrganisationsPage.goodToKnow.contact")}{" "}
              <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
            </NoteText>
          </SectionBlock>
        </ContentSection>
      </Container>
    </PageLayout>
  );
}

export default ForOrganisations;
