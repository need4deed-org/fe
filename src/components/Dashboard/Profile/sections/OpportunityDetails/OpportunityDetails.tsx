"use client";
import Button from "@/components/core/button/Button/Button";
import { ErrorMessage } from "@/components/core/common";
import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Tags } from "@/components/core/common/Tags";
import { EditableField } from "@/components/EditableField/EditableField";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { apiToFormAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/availabilityUtils";
import { formatAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/formatters";
import { useApiActivities, useApiLanguages, useApiSkills } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { ApiOpportunityGet, Lang, LangPurpose } from "need4deed-sdk";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FormButtonRow, FormContainer, FormDetails } from "../shared/styles";
import { EditableSectionRef } from "../shared/types";
import { extractOptionTitles, formatLanguagesByPurpose, languagesToFormValues } from "./formatters";
import { createOpportunityDetailsSchema, OpportunityDetailsFormData } from "./opportunityDetailsSchema";
import { OpportunityWithDetails } from "./types";

const TagsRow = styled.div`
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

const TagsValue = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

const FieldGroup = styled.div`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: var(--editableField-fieldWrapper-padding);
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: flex-start;
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  > label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
    padding-top: var(--spacing-8);
  }

  > div {
    flex: 1;
    min-width: 0;
  }
`;

type Props = {
  opportunity: ApiOpportunityGet;
};

export const OpportunityDetails = forwardRef<EditableSectionRef, Props>(function OpportunityDetails(
  { opportunity },
  ref,
) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const opp = opportunity as OpportunityWithDetails;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";

  const [isEditing, setIsEditing] = useState(false);

  const { data: apiLanguages = [] } = useApiLanguages();
  const { data: apiActivities = [] } = useApiActivities();
  const { data: apiSkills = [] } = useApiSkills();

  const activityMapping = useMemo(() => createMapping(apiActivities), [apiActivities]);
  const skillMapping = useMemo(() => createMapping(apiSkills), [apiSkills]);
  const languagesForForm = useMemo(
    () =>
      apiLanguages.map((l) => ({
        id: l.id,
        title: { [lang as Lang]: l.title } as Record<Lang, string>,
      })),
    [apiLanguages, lang],
  );

  const schema = createOpportunityDetailsSchema();
  const generalLangs = opp.languages.filter((l) => l.purpose === LangPurpose.GENERAL);
  const recipientLangs = opp.languages.filter((l) => l.purpose === LangPurpose.RECIPIENT);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<OpportunityDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      description: opp.description ?? "",
      numberOfVolunteers: String(opp.numberOfVolunteers ?? ""),
      mainCommunication: languagesToFormValues(generalLangs),
      residentsSpeak: languagesToFormValues(recipientLangs),
      availability: apiToFormAvailability(opp.availability),
      activities: opp.activities.map((a) => String(a.id)),
      skills: opp.skills.map((s) => String(s.id)),
    },
  });

  const handleEditClick = () => setIsEditing(true);
  useImperativeHandle(ref, () => ({ handleEditClick }));

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = () => {
    // Mutations will be added later
    setIsEditing(false);
  };

  const mode = isEditing ? "edit" : "display";

  const mainCommunication = formatLanguagesByPurpose(opp.languages, LangPurpose.GENERAL);
  const residentsSpeak = formatLanguagesByPurpose(opp.languages, LangPurpose.RECIPIENT);
  const schedule = formatAvailability(opp.availability, t);
  const activities = extractOptionTitles(opp.activities, lang);
  const skills = extractOptionTitles(opp.skills, lang);

  return (
    <FormContainer data-testid="opportunity-details" $isEditing={isEditing}>
      <FormDetails>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type={isEditing ? "textarea" : "text"}
              label={t(`${prefix}.description`)}
              value={isEditing ? field.value : (opp.description ?? "")}
              setValue={field.onChange}
              maxLength={MAX_DESCRIPTION_LENGTH}
              hint={isEditing ? t(`${prefix}.descriptionHint`, { max: MAX_DESCRIPTION_LENGTH }) : undefined}
            />
          )}
        />

        {isEditing ? (
          <Controller
            name="mainCommunication"
            control={control}
            render={({ field, fieldState }) => (
              <FieldGroup data-testid="opportunity-details-main-communication-edit">
                <label>{t(`${prefix}.mainCommunication`)}</label>
                <div>
                  <LanguageFields
                    languages={field.value}
                    onChange={field.onChange}
                    t={t}
                    availableLanguages={languagesForForm}
                    showLevel={false}
                  />
                  {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
                </div>
              </FieldGroup>
            )}
          />
        ) : (
          <EditableField
            mode="display"
            type="text"
            label={t(`${prefix}.mainCommunication`)}
            value={mainCommunication}
            setValue={() => {}}
          />
        )}

        {isEditing ? (
          <Controller
            name="residentsSpeak"
            control={control}
            render={({ field, fieldState }) => (
              <FieldGroup data-testid="opportunity-details-residents-speak-edit">
                <label>{t(`${prefix}.residentsSpeak`)}</label>
                <div>
                  <LanguageFields
                    languages={field.value}
                    onChange={field.onChange}
                    t={t}
                    availableLanguages={languagesForForm}
                    showLevel={false}
                  />
                  {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
                </div>
              </FieldGroup>
            )}
          />
        ) : (
          <EditableField
            mode="display"
            type="text"
            label={t(`${prefix}.residentsSpeak`)}
            value={residentsSpeak}
            setValue={() => {}}
          />
        )}

        {isEditing ? (
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <FieldGroup data-testid="opportunity-details-schedule-edit">
                <label>{t(`${prefix}.schedule`)}</label>
                <div>
                  <AvailabilityGrid
                    availability={field.value}
                    onChange={field.onChange}
                    t={t}
                    currentLanguage={lang as Lang}
                  />
                </div>
              </FieldGroup>
            )}
          />
        ) : (
          <EditableField
            mode="display"
            type="text"
            label={t(`${prefix}.schedule`)}
            value={schedule}
            setValue={() => {}}
          />
        )}

        <Controller
          name="numberOfVolunteers"
          control={control}
          render={({ field }) => (
            <EditableField
              mode={mode}
              type="stepper"
              label={t(`${prefix}.numberOfVolunteers`)}
              value={isEditing ? field.value : (opp.numberOfVolunteers ?? "")}
              setValue={field.onChange}
            />
          )}
        />

        {isEditing ? (
          <Controller
            name="activities"
            control={control}
            render={({ field }) => (
              <EditableField
                mode="edit"
                type="checkbox-list"
                label={t(`${prefix}.activities`)}
                value={field.value.map((id) => activityMapping.idToTitle[Number(id)] || String(id))}
                setValue={(value) => {
                  const labels = Array.isArray(value) ? value : [value];
                  field.onChange(labels.map((label) => String(activityMapping.titleToId[label])));
                }}
                options={apiActivities.map((a) => a.title)}
              />
            )}
          />
        ) : (
          <TagsRow data-testid="opportunity-details-activities">
            <label>{t(`${prefix}.activities`)}</label>
            <TagsValue>
              {activities.length > 0 ? (
                <Tags tags={activities} backgroundColor="var(--color-salmon)" />
              ) : (
                <EmptyPlaceholder />
              )}
            </TagsValue>
          </TagsRow>
        )}

        {isEditing ? (
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <EditableField
                mode="edit"
                type="checkbox-list"
                label={t(`${prefix}.skills`)}
                value={field.value.map((id) => skillMapping.idToTitle[Number(id)] || String(id))}
                setValue={(value) => {
                  const labels = Array.isArray(value) ? value : [value];
                  field.onChange(labels.map((label) => String(skillMapping.titleToId[label])));
                }}
                options={apiSkills.map((s) => s.title)}
              />
            )}
          />
        ) : (
          <TagsRow data-testid="opportunity-details-skills">
            <label>{t(`${prefix}.skills`)}</label>
            <TagsValue>
              {skills.length > 0 ? (
                <Tags tags={skills} backgroundColor="var(--color-pink-50)" />
              ) : (
                <EmptyPlaceholder />
              )}
            </TagsValue>
          </TagsRow>
        )}
      </FormDetails>

      {isEditing && (
        <FormButtonRow>
          <Button
            text={t(`${prefix}.cancel`)}
            onClick={handleCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t(`${prefix}.saveChanges`)}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            disabled={!isDirty || !isValid}
          />
        </FormButtonRow>
      )}
    </FormContainer>
  );
});
