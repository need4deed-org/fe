import Button from "@/components/core/button/Button/Button";
import { ErrorMessage } from "@/components/core/common";
import { EditableField } from "@/components/EditableField/EditableField";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { apiToFormAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/availabilityUtils";
import { useApiActivities, useApiLanguages, useApiSkills } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { ApiOpportunityGet, Lang, LangPurpose } from "need4deed-sdk";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../shared/styles";
import { languagesToFormValues } from "./formatters";
import { createOpportunityDetailsSchema, OpportunityDetailsFormData } from "./opportunityDetailsSchema";
import { FieldGroup } from "./styles";
import { OpportunityWithDetails } from "./types";

type Props = {
  opportunity: ApiOpportunityGet;
  onCancel: () => void;
};

export function OpportunityDetailsEdit({ opportunity, onCancel }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const opp = opportunity as OpportunityWithDetails;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";

  const { data: apiLanguages = [] } = useApiLanguages();
  const { data: apiActivities = [] } = useApiActivities();
  const { data: apiSkills = [] } = useApiSkills();

  const activityMapping = createMapping(apiActivities);
  const skillMapping = createMapping(apiSkills);
  const languagesForForm = apiLanguages.map((l) => ({
    id: l.id,
    title: { [lang as Lang]: l.title } as Record<Lang, string>,
  }));

  const generalLangs = opp.languages.filter((l) => l.purpose === LangPurpose.GENERAL);
  const recipientLangs = opp.languages.filter((l) => l.purpose === LangPurpose.RECIPIENT);

  const schema = createOpportunityDetailsSchema(t);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
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

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = () => {
    // Mutations will be added later
    onCancel();
  };

  return (
    <>
      <FormDetails>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="textarea"
              label={t(`${prefix}.description`)}
              value={field.value}
              setValue={field.onChange}
              maxLength={MAX_DESCRIPTION_LENGTH}
              hint={t(`${prefix}.descriptionHint`, { max: MAX_DESCRIPTION_LENGTH })}
              errorMessage={errors.description?.message}
            />
          )}
        />

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

        <Controller
          name="availability"
          control={control}
          render={({ field, fieldState }) => (
            <FieldGroup data-testid="opportunity-details-schedule-edit">
              <label>{t(`${prefix}.schedule`)}</label>
              <div>
                <AvailabilityGrid
                  availability={field.value}
                  onChange={field.onChange}
                  t={t}
                  currentLanguage={lang as Lang}
                />
                {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
              </div>
            </FieldGroup>
          )}
        />

        <Controller
          name="numberOfVolunteers"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="stepper"
              label={t(`${prefix}.numberOfVolunteers`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.numberOfVolunteers?.message}
            />
          )}
        />

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
              errorMessage={errors.activities?.message}
            />
          )}
        />

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
              errorMessage={errors.skills?.message}
            />
          )}
        />
      </FormDetails>

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
    </>
  );
}
