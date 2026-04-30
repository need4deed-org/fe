"use client";
import { useApiDistricts, useApiLanguages } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { useUpdateOpportunityAccompanyingDetails } from "@/hooks/useUpdateOpportunityAccompanyingDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { de, enUS } from "date-fns/locale";
import { ApiOpportunityGet } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { useEditingChangeNotifier } from "../shared/useEditingChangeNotifier";
import { AccompanyingDetailsDisplay } from "./AccompanyingDetailsDisplay";
import { AccompanyingDetailsEdit } from "./AccompanyingDetailsEdit";
import { AppointmentLanguages } from "@/config/constants";
import { getInitialFormValues, getMinAppointmentDate, isAccompanyingType } from "./helpers";
import { AccompanyingDetailsFormData, accompanyingDetailsSchema } from "./accompanyingDetailsSchema";
import { Container, NotAccompanyingMessage } from "./styles";

type Props = {
  opportunity: ApiOpportunityGet;
} & EditableSectionProps;

export const AccompanyingDetails = forwardRef<EditableSectionRef, Props>(function AccompanyingDetails(
  { opportunity, onEditingChange },
  ref,
) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;
  const { mutate: updateAccompanyingDetails, isPending } = useUpdateOpportunityAccompanyingDetails(opportunity.id);
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);
  const { data: apiLanguages } = useApiLanguages();
  const { data: apiDistricts } = useApiDistricts();
  const showFullDetails = isAccompanyingType(opportunity.volunteerType);
  const minAppointmentDate = useMemo(() => getMinAppointmentDate(), []);

  const languageOptions = apiLanguages.map((lang) => lang.title);

  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  apiLanguages.forEach((lang) => {
    keyToLabel[String(lang.id)] = lang.title;
    labelToKey[lang.title] = String(lang.id);
  });

  const appointmentLanguageKeys = Object.values(AppointmentLanguages);
  const appointmentLanguageKeyToLabel: Record<string, string> = {};
  const appointmentLanguageLabelToKey: Record<string, string> = {};
  appointmentLanguageKeys.forEach((key) => {
    const label = t(`dashboard.opportunityProfile.accompanyingDetails.appointmentLanguageOptions.${key}`);
    appointmentLanguageKeyToLabel[key] = label;
    appointmentLanguageLabelToKey[label] = key;
  });
  const appointmentLanguageOptions = appointmentLanguageKeys.map((key) => appointmentLanguageKeyToLabel[key]);

  const districtKeyToLabel: Record<string, string> = {};
  const districtLabelToKey: Record<string, string> = {};
  apiDistricts.forEach((district) => {
    districtKeyToLabel[String(district.id)] = district.title;
    districtLabelToKey[district.title] = String(district.id);
  });
  const districtOptions = apiDistricts.map((district) => district.title);

  const initialFormValues = getInitialFormValues(opportunity.accompanyingDetails);

  const methods = useForm<AccompanyingDetailsFormData>({
    resolver: zodResolver(accompanyingDetailsSchema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });
  const { handleSubmit, reset, watch } = methods;

  const formValues = watch();

  const handleEditClick = () => {
    if (showFullDetails) {
      setIsEditing(true);
    }
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
          appointmentPostcode: values.appointmentPostcode || undefined,
          appointmentDistrict: values.appointmentDistrict || undefined,
          appointmentDate: values.appointmentDate ? values.appointmentDate.toISOString() : undefined,
          appointmentTime: values.appointmentTime || undefined,
          refugeeNumber: values.refugeeNumber,
          refugeeName: values.refugeeName,
          languagesToTranslate: values.languagesToTranslate ?? [],
          appointmentLanguage: values.appointmentLanguage || undefined,
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
      reset(getInitialFormValues(opportunity.accompanyingDetails));
    }
  }, [opportunity, isEditing, reset]);

  if (!showFullDetails) {
    return (
      <div data-testid="accompanying-details-not-accompanying">
        <NotAccompanyingMessage>
          {t("dashboard.opportunityProfile.accompanyingDetails.notAccompanyingMessage")}
        </NotAccompanyingMessage>
      </div>
    );
  }

  const languageLabel = (formValues.languagesToTranslate ?? []).map((id) => keyToLabel[id] || id).join(", ");
  const districtLabel =
    districtKeyToLabel[formValues.appointmentDistrict || ""] || formValues.appointmentDistrict || "";

  return (
    <FormProvider {...methods}>
      <Container data-testid="accompanying-details-container" $isEditing={isEditing}>
        {isEditing ? (
          <AccompanyingDetailsEdit
            locale={locale}
            languageOptions={languageOptions}
            keyToLabel={keyToLabel}
            labelToKey={labelToKey}
            appointmentLanguageOptions={appointmentLanguageOptions}
            appointmentLanguageKeyToLabel={appointmentLanguageKeyToLabel}
            appointmentLanguageLabelToKey={appointmentLanguageLabelToKey}
            districtOptions={districtOptions}
            districtKeyToLabel={districtKeyToLabel}
            districtLabelToKey={districtLabelToKey}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
            minAppointmentDate={minAppointmentDate}
          />
        ) : (
          <AccompanyingDetailsDisplay values={formValues} languageLabel={languageLabel} districtLabel={districtLabel} />
        )}
      </Container>
    </FormProvider>
  );
});
