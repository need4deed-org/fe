"use client";
import Button from "@/components/core/button/Button/Button";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { EditableField } from "@/components/EditableField/EditableField";
import { useApiLanguages } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { useUpdateOpportunityAccompanyingDetails } from "@/hooks/useUpdateOpportunityAccompanyingDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { ApiOpportunityGet } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  accompanyingDetailsSchema,
  AccompanyingDetailsFormData,
} from "./accompanyingDetailsSchema";
import { AccompanyingDetailsRef } from "./types";

const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isEditing ? "var(--spacing-16)" : "0")};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-24);
  width: 100%;
`;

const DateFieldRow = styled.div`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: var(--editableField-fieldWrapper-padding);
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
  }
`;

const DatePickerContainer = styled.div`
  flex: 1;
`;

const TimeInputWrapper = styled.div`
  flex: 1;
`;

const TimeInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  border-radius: var(--editableField-fieldWrapper-input-borderRadius);
  padding: var(--editableField-fieldWrapper-input-padding);
  color: var(--color-midnight);
  border: ${(props) =>
    props.$hasError ? "2px solid var(--color-red-600)" : "var(--editableField-fieldWrapper-input-border)"};

  &:focus {
    outline: none;
    border: ${(props) => (props.$hasError ? "2px solid var(--color-red-600)" : "2px solid var(--color-green-200)")};
  }
`;

const ErrorText = styled.span`
  color: var(--color-red-600);
  font-size: var(--font-size-14);
  margin-top: var(--spacing-4);
`;

type Props = {
  opportunity: ApiOpportunityGet;
};

type AccompanyingDetailsData = {
  appointmentAddress?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  refugeeNumber?: string;
  refugeeName?: string;
  languagesToTranslate?: string[];
};

export const AccompanyingDetails = forwardRef<AccompanyingDetailsRef, Props>(
  function AccompanyingDetails({ opportunity }, ref) {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === "de" ? de : enUS;
    const { mutate: updateAccompanyingDetails, isPending } = useUpdateOpportunityAccompanyingDetails(opportunity.id);
    const [isEditing, setIsEditing] = useState(false);
    const { data: apiLanguages } = useApiLanguages();

    const languageOptions = useMemo(() => apiLanguages.map((lang) => lang.title), [apiLanguages]);

    const keyToLabel: Record<string, string> = {};
    const labelToKey: Record<string, string> = {};
    apiLanguages.forEach((lang) => {
      keyToLabel[String(lang.id)] = lang.title;
      labelToKey[lang.title] = String(lang.id);
    });

    const parseDate = (dateStr: string | undefined): Date | null => {
      if (!dateStr) return null;
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? null : parsed;
    };

    const initialFormValues = useMemo((): AccompanyingDetailsFormData => {
      // @ts-expect-error accompanyingDetails missing on SDK ApiOpportunityGet type
      const details = opportunity.accompanyingDetails as AccompanyingDetailsData | undefined;

      return {
        appointmentAddress: details?.appointmentAddress || "",
        appointmentDate: parseDate(details?.appointmentDate),
        appointmentTime: details?.appointmentTime || "",
        refugeeNumber: details?.refugeeNumber || "",
        refugeeName: details?.refugeeName || "",
        languagesToTranslate: details?.languagesToTranslate || [],
      };
    }, [opportunity]);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isValid, isDirty },
    } = useForm<AccompanyingDetailsFormData>({
      resolver: zodResolver(accompanyingDetailsSchema),
      mode: "onChange",
      defaultValues: initialFormValues,
    });

    const handleEditClick = () => {
      setIsEditing(true);
    };

    useImperativeHandle(ref, () => ({
      handleEditClick,
    }));

    const handleCancel = () => {
      reset();
      setIsEditing(false);
    };

    const onSubmit = (values: AccompanyingDetailsFormData) => {
      updateAccompanyingDetails(
        {
          accompanyingDetails: {
            appointmentAddress: values.appointmentAddress,
            appointmentDate: values.appointmentDate ? values.appointmentDate.toISOString() : undefined,
            appointmentTime: values.appointmentTime || undefined,
            refugeeNumber: values.refugeeNumber,
            refugeeName: values.refugeeName,
            languagesToTranslate: values.languagesToTranslate,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        },
      );
    };

    useEffect(() => {
      if (!isEditing) {
        reset(initialFormValues);
      }
    }, [initialFormValues, isEditing, reset]);

    return (
      <Container data-testid="accompanying-details-container" $isEditing={isEditing}>
        <Details>
          <Controller
            name="appointmentAddress"
            control={control}
            render={({
              field,
            }: {
              field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentAddress">;
            }) => (
              <EditableField
                mode={isEditing ? "edit" : "display"}
                type="text"
                label={t("dashboard.opportunityProfile.accompanyingDetails.appointmentAddress")}
                value={field.value || ""}
                setValue={field.onChange}
                errorMessage={errors.appointmentAddress?.message}
              />
            )}
          />

          <Controller
            name="appointmentDate"
            control={control}
            render={({
              field,
            }: {
              field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentDate">;
            }) => (
              <DateFieldRow data-testid="appointment-date-field">
                <label>{t("dashboard.opportunityProfile.accompanyingDetails.appointmentDate")}</label>
                {isEditing ? (
                  <DatePickerContainer>
                    <DatePickerWithLabel
                      date={field.value ?? undefined}
                      onSelect={(d) => field.onChange(d ?? null)}
                      locale={locale}
                      allowFuture
                    />
                  </DatePickerContainer>
                ) : (
                  <span>{field.value ? format(field.value, "dd.MM.yyyy") : "—"}</span>
                )}
              </DateFieldRow>
            )}
          />

          <Controller
            name="appointmentTime"
            control={control}
            render={({
              field,
            }: {
              field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentTime">;
            }) => (
              <DateFieldRow data-testid="appointment-time-field">
                <label>{t("dashboard.opportunityProfile.accompanyingDetails.appointmentTime")}</label>
                {isEditing ? (
                  <TimeInputWrapper>
                    <TimeInput
                      type="text"
                      placeholder="HH:MM"
                      value={field.value || ""}
                      onChange={field.onChange}
                      $hasError={!!errors.appointmentTime}
                    />
                    {errors.appointmentTime && (
                      <ErrorText>
                        {t(`dashboard.opportunityProfile.accompanyingDetails.validation.${errors.appointmentTime.message}`)}
                      </ErrorText>
                    )}
                  </TimeInputWrapper>
                ) : (
                  <span>{field.value || "—"}</span>
                )}
              </DateFieldRow>
            )}
          />

          <Controller
            name="refugeeNumber"
            control={control}
            render={({
              field,
            }: {
              field: ControllerRenderProps<AccompanyingDetailsFormData, "refugeeNumber">;
            }) => (
              <EditableField
                mode={isEditing ? "edit" : "display"}
                type="text"
                label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeNumber")}
                value={field.value || ""}
                setValue={field.onChange}
                errorMessage={errors.refugeeNumber?.message}
              />
            )}
          />

          <Controller
            name="refugeeName"
            control={control}
            render={({
              field,
            }: {
              field: ControllerRenderProps<AccompanyingDetailsFormData, "refugeeName">;
            }) => (
              <EditableField
                mode={isEditing ? "edit" : "display"}
                type="text"
                label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeName")}
                value={field.value || ""}
                setValue={field.onChange}
                errorMessage={errors.refugeeName?.message}
              />
            )}
          />

          <Controller
            name="languagesToTranslate"
            control={control}
            render={({
              field,
            }: {
              field: ControllerRenderProps<AccompanyingDetailsFormData, "languagesToTranslate">;
            }) => (
              <EditableField
                mode={isEditing ? "edit" : "display"}
                type="checkbox-list"
                label={t("dashboard.opportunityProfile.accompanyingDetails.languageToTranslate")}
                value={(field.value || []).map((id) => keyToLabel[id] || id)}
                setValue={(value) => {
                  const labels = Array.isArray(value) ? value : [value];
                  field.onChange(labels.map((label) => labelToKey[label] || label));
                }}
                options={languageOptions}
                errorMessage={errors.languagesToTranslate?.message}
              />
            )}
          />
        </Details>

        {isEditing && (
          <ButtonRow>
            <Button
              text={t("dashboard.opportunityProfile.accompanyingDetails.cancel")}
              onClick={handleCancel}
              width="auto"
              padding="var(--volunteer-profile-section-card-header-button-padding)"
              backgroundcolor="var(--color-white)"
              textColor="var(--color-aubergine)"
              border="var(--volunteer-profile-section-card-header-button-border)"
            />
            <Button
              text={t("dashboard.opportunityProfile.accompanyingDetails.saveChanges")}
              onClick={handleSubmit(onSubmit)}
              width="auto"
              padding="var(--volunteer-profile-section-card-header-button-padding)"
              disabled={!isDirty || !isValid || isPending}
            />
          </ButtonRow>
        )}
      </Container>
    );
  },
);
