"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { useApiLanguages } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { useUpdateOpportunityAccompanyingDetails } from "@/hooks/useUpdateOpportunityAccompanyingDetails";
import { zodResolver } from "@hookform/resolvers/zod";
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

type Props = {
  opportunity: ApiOpportunityGet;
};

type AccompanyingDetailsData = {
  appointmentAddress?: string;
  refugeeNumber?: string;
  refugeeName?: string;
  languagesToTranslate?: string[];
};

export const AccompanyingDetails = forwardRef<AccompanyingDetailsRef, Props>(
  function AccompanyingDetails({ opportunity }, ref) {
    const { t } = useTranslation();
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

    const initialFormValues = useMemo((): AccompanyingDetailsFormData => {
      // @ts-expect-error accompanyingDetails missing on SDK ApiOpportunityGet type
      const details = opportunity.accompanyingDetails as AccompanyingDetailsData | undefined;

      return {
        appointmentAddress: details?.appointmentAddress || "",
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
