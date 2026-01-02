"use client";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { PageLayout } from "../Layout";

function FAQs() {
  const FAQsTitle = styled.h1`
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-xxl);
    margin-top: var(--space-xxl);
    text-align: center;
    color: var(--color-neutral-200);
  `;

  const FAQquestion = styled.h6`
    font-weight: var(--font-weight-bold);
    margin-bottom: calc(var(--space-xs) + 1px);
    color: var(--color-neutral-200);
  `;

  const FAQanswer = styled.p`
    margin-left: var(--space-md);
    margin-bottom: var(--font-size-2xl);
  `;

  const { t } = useTranslation();

  const faqs = [
    {
      question: t("faqs.first_steps_question"),
      answer: t("faqs.first_steps_answer"),
    },
    {
      question: t("faqs.after_form_question"),
      answer: t("faqs.after_form_answer"),
    },
    {
      question: t("faqs.find_opportunities_question"),
      answer: t("faqs.find_opportunities_answer"),
    },
    {
      question: t("faqs.volunteer_roles_question"),
      answer: t("faqs.volunteer_roles_answer"),
    },
    {
      question: t("faqs.special_skills_question"),
      answer: t("faqs.special_skills_answer"),
    },
    {
      question: t("faqs.volunteering_time_question"),
      answer: t("faqs.volunteering_time_answer"),
    },
    {
      question: t("faqs.age_requirements_question"),
      answer: t("faqs.age_requirements_answer"),
    },
    {
      question: t("faqs.voluntea_gatherings_question"),
      answer: t("faqs.voluntea_gatherings_answer"),
    },
    {
      question: t("faqs.training_question"),
      answer: t("faqs.training_answer"),
    },
    {
      question: t("faqs.group_volunteering_question"),
      answer: t("faqs.group_volunteering_answer"),
    },
  ];

  return (
    <PageLayout background="var(--color-orchid)">
      <div className="n4d-container">
        <FAQsTitle>{t("faqs.title")}</FAQsTitle>
        {faqs.map((faq) => (
          <div key={faq.question} className="faq-item">
            <FAQquestion>{faq.question}</FAQquestion>
            <FAQanswer>{faq.answer}</FAQanswer>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export default FAQs;
