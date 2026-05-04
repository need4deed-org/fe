"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { PageLayout } from "@/components/Layout";

import { StepDateTime } from "./StepDateTime";
import { StepLocation } from "./StepLocation";
import { StepTitle } from "./StepTitle";

export interface EventFormData {
  title: string;
  description: string;
  street: string;
  houseNumber: string;
  postcode: string;
  date: string;
  time: string;
}

const TOTAL_STEPS = 3;

export function CreateEvent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    street: "",
    houseNumber: "",
    postcode: "",
    date: "",
    time: "",
  });

  const update = (fields: Partial<EventFormData>) => setFormData((prev) => ({ ...prev, ...fields }));

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => {
    if (step === 1) {
      router.push(`/${i18n.language}/dashboard/calendar`);
    } else {
      setStep((s) => s - 1);
    }
  };
  const handleCancel = () => router.push(`/${i18n.language}/dashboard/calendar`);

  const isNextEnabled = () => {
    if (step === 1) return formData.title.trim().length > 0;
    if (step === 2)
      return (
        formData.street.trim().length > 0 &&
        formData.houseNumber.trim().length > 0 &&
        formData.postcode.trim().length > 0
      );
    if (step === 3) return formData.date.length > 0 && formData.time.length > 0;
    return false;
  };

  return (
    <PageLayout background="var(--color-orchid-subtle)">
      <PageContent>
        <ProgressBar>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <ProgressSegment key={i} $active={i < step} />
          ))}
        </ProgressBar>

        <Card>
          {step === 1 && (
            <StepTitle
              title={formData.title}
              description={formData.description}
              onChange={update}
              onNext={handleNext}
              onCancel={handleCancel}
              t={t}
              isNextEnabled={isNextEnabled()}
            />
          )}
          {step === 2 && (
            <StepLocation
              street={formData.street}
              houseNumber={formData.houseNumber}
              postcode={formData.postcode}
              onChange={update}
              onNext={handleNext}
              onBack={handleBack}
              t={t}
              isNextEnabled={isNextEnabled()}
            />
          )}
          {step === 3 && (
            <StepDateTime
              date={formData.date}
              time={formData.time}
              onChange={update}
              onBack={handleBack}
              t={t}
              isNextEnabled={isNextEnabled()}
            />
          )}
        </Card>
      </PageContent>
    </PageLayout>
  );
}

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-32);
  padding: 48px 24px 100px;
  width: 100%;
  box-sizing: border-box;
`;

const ProgressBar = styled.div`
  display: flex;
  gap: var(--spacing-8);
  width: 100%;
  max-width: 800px;
`;

const ProgressSegment = styled.div<{ $active: boolean }>`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${({ $active }) => ($active ? "var(--color-midnight)" : "var(--color-orchid)")};
  transition: background 0.2s ease;
`;

const Card = styled.div`
  background: var(--color-white);
  border-radius: var(--border-radius-lg, 16px);
  padding: var(--spacing-32);
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;
