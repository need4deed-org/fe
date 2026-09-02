"use client";

import { Button } from "@/components/core/button";
import { apiPathOption } from "@/config/constants";
import { useRegisterVolunteer } from "@/hooks/useRegisterVolunteer";
import { setAuthHint } from "@/utils/helpers";
import { useForm } from "@tanstack/react-form";
import i18next from "i18next";
import { ApiOptionLists } from "need4deed-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProgressBar } from "../ProgressBar";
import { AddressStep } from "../steps/AddressStep";
import { AvailabilityStep } from "../steps/AvailabilityStep";
import { CertificateStep } from "../steps/CertificateStep";
import { Actions, Card, ErrorBanner, PageSubtitle, PageTitle, StepDescription, StepTitle, Wrapper } from "../styled";
import { defaultVolunteerRegistrationData, ProfileCompletionData, TOTAL_COMPLETION_STEPS } from "../types";
import { useGetQuery } from "@/hooks";

export function ProfileCompletion() {
  const { t } = useTranslation();
  const router = useRouter();
  const token = useSearchParams().get("token");

  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const { data: optionLists } = useGetQuery<ApiOptionLists>({
    queryKey: ["options"],
    apiPath: apiPathOption,
  });

  const registerMutation = useRegisterVolunteer({
    token,
    onSuccess: () => {
      setAuthHint();
      router.push(`/${i18next.language}/dashboard`);
    },
  });

  const formVolunteer = useForm<ProfileCompletionData>({
    defaultValues: defaultVolunteerRegistrationData,
    onSubmit: async ({ value }) => {
      if (!token) {
        showSubmitError(t("volunteerRegistration.errors.missingToken"));
        return;
      }
      setSubmitError(null);
      try {
        await registerMutation.mutateAsync({ volunteer: value });
      } catch (error) {
        showSubmitError(t("message.errorGeneric"));
        console.error(error);
      }
    },
  });

  const showSubmitError = useCallback((message: string) => {
    setSubmitError(message);
    requestAnimationFrame(() => {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  useEffect(() => {
    if (!token) showSubmitError(t("agentRegistration.errors.missingToken"));
  }, [token, t, showSubmitError]);

  const handleNext = async () => {
    const errors = await formVolunteer.validateAllFields("submit");
    const hasStepErrors = Object.keys(errors).length > 0;

    if (!hasStepErrors) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    Object.keys(formVolunteer.state.values).forEach((fieldName) => {
      formVolunteer.setFieldMeta(fieldName as keyof ProfileCompletionData, (prev) => ({
        ...prev,
        errors: [],
        errorMap: {},
        isTouched: false,
      }));
    });

    setStep((s) => s - 1);
  };

  const isLastStep = step === TOTAL_COMPLETION_STEPS;
  const tokenMissing = !token;

  return (
    <Wrapper>
      <Card>
        <PageTitle>{t("volunteerRegistration.completion.title")}</PageTitle>
        <PageSubtitle>{t("volunteerRegistration.completion.subtitle")}</PageSubtitle>

        <ProgressBar currentStep={step} totalSteps={TOTAL_COMPLETION_STEPS} />

        {submitError && <ErrorBanner ref={errorBannerRef}>{submitError}</ErrorBanner>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formVolunteer.handleSubmit();
          }}
        >
          {step === 1 && (
            <div>
              <StepTitle>{t("volunteerRegistration.steps.address.title")}</StepTitle>
              <StepDescription>{t("volunteerRegistration.steps.address.description")}</StepDescription>
              <AddressStep form={formVolunteer} optionLists={optionLists} />
            </div>
          )}

          {step === 2 && (
            <div>
              <StepTitle>{t("volunteerRegistration.steps.availabilityInfo.title")}</StepTitle>
              <StepDescription>{t("volunteerRegistration.steps.availabilityInfo.description")}</StepDescription>
              <AvailabilityStep form={formVolunteer} optionLists={optionLists} />
            </div>
          )}

          {step === 3 && (
            <div>
              <StepTitle>{t("volunteerRegistration.steps.certificates.title")}</StepTitle>
              <StepDescription>{t("volunteerRegistration.steps.certificates.description")}</StepDescription>
              <CertificateStep form={formVolunteer} optionLists={optionLists} />
            </div>
          )}

          <Actions>
            {step > 1 ? (
              <formVolunteer.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    text={t("volunteerRegistration.back")}
                    backgroundcolor="var(--color-white)"
                    textColor="var(--color-aubergine)"
                    border="1px solid var(--color-aubergine)"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  />
                )}
              </formVolunteer.Subscribe>
            ) : (
              <div />
            )}

            {isLastStep ? (
              <formVolunteer.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    text={t("volunteerRegistration.submit")}
                    backgroundcolor="var(--color-aubergine)"
                    textColor="var(--color-white)"
                    disabled={isSubmitting || tokenMissing}
                  />
                )}
              </formVolunteer.Subscribe>
            ) : (
              <Button
                type="button"
                text={t("volunteerRegistration.next")}
                backgroundcolor="var(--color-aubergine)"
                textColor="var(--color-white)"
                onClick={handleNext}
                disabled={tokenMissing}
              />
            )}
          </Actions>
        </form>
      </Card>
    </Wrapper>
  );
}
