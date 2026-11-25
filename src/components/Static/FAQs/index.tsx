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
  QuestionRow,
  SectionBlock,
  SectionHeader,
  TextLink,
} from "../styled";

type FaqItem = { key: string; link?: ((lang: string) => string) | string };

const MAILTO = `mailto: ${EMAILS.contact}`;

const SECTIONS: { key: string; items: FaqItem[] }[] = [
  {
    key: "volunteers",
    items: [
      { key: "register", link: ROUTES.registerVolunteer },
      { key: "afterRegistration" },
      { key: "documents" },
      { key: "accompaniment" },
      { key: "suggestions" },
      { key: "time" },
      { key: "skills" },
      { key: "age" },
      { key: "changes" },
      { key: "login", link: ROUTES.forgotPassword },
      { key: "events", link: ROUTES.events },
      { key: "groups", link: MAILTO },
    ],
  },
  {
    key: "organisations",
    items: [
      { key: "register", link: ROUTES.registerOrganization },
      { key: "request" },
      { key: "afterRequest" },
      { key: "noMatch" },
      { key: "ownVolunteers" },
      { key: "dashboard" },
      { key: "costs" },
      { key: "more", link: ROUTES.forOrganizations },
    ],
  },
];

function FAQs() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Container>
      <Heading>{t("faqs.title")}</Heading>

      <ContentSection>
        {SECTIONS.map((section) => (
          <SectionBlock key={section.key}>
            <SectionHeader>{t(`faqs.${section.key}.heading`)}</SectionHeader>
            <ItemsList>
              {section.items.map((item, index) => {
                const prefix = `faqs.${section.key}.${item.key}`;
                return (
                  <Item key={item.key}>
                    <QuestionRow>
                      <Badge>{index + 1}</Badge>
                      <ItemTitle>{t(`${prefix}.question`)}</ItemTitle>
                    </QuestionRow>
                    <AnswerRow>
                      <DashContainer>
                        <Dash />
                      </DashContainer>
                      <ItemBody>
                        {t(`${prefix}.answer`)}
                        {item.link && (
                          <>
                            {" "}
                            <TextLink href={typeof item.link === "string" ? item.link : item.link(lang)}>
                              {item.link === MAILTO ? EMAILS.contact : t(`${prefix}.link`)}
                            </TextLink>
                          </>
                        )}
                      </ItemBody>
                    </AnswerRow>
                  </Item>
                );
              })}
            </ItemsList>
          </SectionBlock>
        ))}
      </ContentSection>
    </Container>
  );
}

export default FAQs;
