"use client";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import { EMAILS } from "@/constants/emails";
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
  "discussions",
  "openSource",
];

export const ForOrganizations = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Container>
      <Heading>{t("forOrganizationsPage.heading")}</Heading>

      <ContentSection>
        <NoteText>{t("forOrganizationsPage.intro")}</NoteText>

        <SectionBlock>
          <SubHeading>{t("forOrganizationsPage.stepsHeading")}</SubHeading>
          <NoteText>{t("forOrganizationsPage.stepsIntro")}</NoteText>
          <CardGrid>
            {STEPS.map((step, index) => (
              <Card key={step}>
                <QuestionRow>
                  <Badge>{index + 1}</Badge>
                  <SectionHeader as="h4">{t(`forOrganizationsPage.steps.${step}.title`)}</SectionHeader>
                </QuestionRow>
                <NoteText>{t(`forOrganizationsPage.steps.${step}.body`)}</NoteText>
              </Card>
            ))}
          </CardGrid>
        </SectionBlock>

        <SectionBlock>
          <SubHeading>{t("forOrganizationsPage.dashboard.heading")}</SubHeading>
          <NoteText>{t("forOrganizationsPage.dashboard.intro")}</NoteText>
          <CardGrid>
            {DASHBOARD_FEATURES.map((feature) => (
              <Card key={feature}>
                <SectionHeader as="h4">{t(`forOrganizationsPage.dashboard.features.${feature}.title`)}</SectionHeader>
                <NoteText>{t(`forOrganizationsPage.dashboard.features.${feature}.body`)}</NoteText>
              </Card>
            ))}
          </CardGrid>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>{t("forOrganizationsPage.goodToKnow.heading")}</SectionHeader>
          <NoteText>{t("forOrganizationsPage.goodToKnow.free")}</NoteText>
          <NoteText>
            {t("forOrganizationsPage.goodToKnow.register")}{" "}
            <TextLink href={ROUTES.registerOrganization(lang)}>
              {t("forOrganizationsPage.goodToKnow.registerLink")}
            </TextLink>
          </NoteText>
          <NoteText>
            {t("forOrganizationsPage.goodToKnow.guidelines")}{" "}
            <TextLink href={ROUTES.racGuidelines(lang)}>{t("forOrganizationsPage.goodToKnow.guidelinesLink")}</TextLink>
          </NoteText>
          <NoteText>
            {t("forOrganizationsPage.goodToKnow.contact")}{" "}
            <TextLink href={`mailto:${EMAILS.contact}`}>{EMAILS.contact}</TextLink>
          </NoteText>
        </SectionBlock>
      </ContentSection>
    </Container>
  );
};
