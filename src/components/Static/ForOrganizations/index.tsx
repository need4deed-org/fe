"use client";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import { EMAILS } from "@/constants/emails";
import {
  AnswerRow,
  Badge,
  Container,
  ContentSection,
  Dash,
  DashContainer,
  Heading,
  Item,
  ItemBody,
  ItemsList,
  ItemTitle,
  NoteText,
  QuestionRow,
  SectionBlock,
  SectionHeader,
  TextLink,
} from "../styled";

const STEPS = ["request", "prepare", "match", "introduction", "noMatch", "afterMatch"];
const DASHBOARD_FEATURES = ["volunteers", "hours", "discussions", "openSource"];

function ForOrganizations() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Container>
      <Heading>{t("forOrganizationsPage.heading")}</Heading>

      <ContentSection>
        <NoteText>{t("forOrganizationsPage.intro")}</NoteText>

        <SectionBlock>
          <SectionHeader>{t("forOrganizationsPage.stepsHeading")}</SectionHeader>
          <ItemsList>
            {STEPS.map((step, index) => (
              <Item key={step}>
                <QuestionRow>
                  <Badge>{index + 1}</Badge>
                  <ItemTitle>{t(`forOrganizationsPage.steps.${step}.title`)}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <ItemBody>{t(`forOrganizationsPage.steps.${step}.body`)}</ItemBody>
                </AnswerRow>
              </Item>
            ))}
          </ItemsList>
        </SectionBlock>

        <SectionBlock>
          <SectionHeader>{t("forOrganizationsPage.dashboard.heading")}</SectionHeader>
          <NoteText>{t("forOrganizationsPage.dashboard.intro")}</NoteText>
          <ItemsList>
            {DASHBOARD_FEATURES.map((feature, index) => (
              <Item key={feature}>
                <QuestionRow>
                  <Badge>{index + 1}</Badge>
                  <ItemTitle>{t(`forOrganizationsPage.dashboard.features.${feature}.title`)}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <ItemBody>{t(`forOrganizationsPage.dashboard.features.${feature}.body`)}</ItemBody>
                </AnswerRow>
              </Item>
            ))}
          </ItemsList>
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
            <TextLink href={`mailto: ${EMAILS.contact}`}>{EMAILS.contact}</TextLink>
          </NoteText>
        </SectionBlock>
      </ContentSection>
    </Container>
  );
}

export default ForOrganizations;
