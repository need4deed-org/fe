"use client";
import Button from "@/components/core/button/Button/Button";
import { Heading2 } from "@/components/styled/text";
import { useUpdateVolunteerProfile } from "@/hooks/useUpdateVolunteerProfile";
import { LanguageLevel } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle } from "@phosphor-icons/react";
import { ApiVolunteerGet, Lang, VolunteerStateTypeType } from "need4deed-sdk";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { apiToFormAvailability, formToApiAvailability } from "./availabilityUtils";
import { LEVEL_TO_PROFICIENCY } from "./constants";
import { DisplayFields } from "./DisplayFields";
import {
  extractTitles,
  formatActivities,
  formatAvailability,
  formatDistricts,
  formatLanguages,
  formatLanguagesForDisplay,
  formatLocationsForDisplay,
  formatSkills,
  getVolunteerTypeLabel,
} from "./formatters";
import { FormFields } from "./FormFields";
import { useApiActivities, useApiDistricts, useApiLanguages, useApiSkills } from "./hooks";
import { createMapping } from "./mappingUtils";
import { createVolunteerProfileSchema, VolunteerProfileFormData } from "./volunteerProfileSchema";

const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: ${(props) => (props.$isEditing ? "16px" : "8px")};
  background: var(--color-white);
  border-radius: 24px;
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: var(--color-papaya);
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

type Props = {
  volunteer: ApiVolunteerGet;
};

export function VolunteerProfileSection({ volunteer }: Props) {
  const { t, i18n } = useTranslation();
  const { mutate: updateProfile, isPending } = useUpdateVolunteerProfile(volunteer.id);
  const [isEditing, setIsEditing] = useState(false);

  const { data: apiLanguages = [] } = useApiLanguages(i18n.language as Lang);
  const { data: apiActivities = [] } = useApiActivities(i18n.language as Lang);
  const { data: apiSkills = [] } = useApiSkills(i18n.language as Lang);
  const { data: apiDistricts = [] } = useApiDistricts(i18n.language as Lang);

  const languageMapping = useMemo(() => createMapping(apiLanguages), [apiLanguages]);
  const activityMapping = useMemo(() => createMapping(apiActivities), [apiActivities]);
  const skillMapping = useMemo(() => createMapping(apiSkills), [apiSkills]);
  const districtMapping = useMemo(() => createMapping(apiDistricts), [apiDistricts]);

  const languagesForForm = useMemo(
    () => apiLanguages.map((lang) => ({ id: lang.id, title: { [i18n.language as Lang]: lang.title } as Record<Lang, string> })),
    [apiLanguages, i18n.language],
  );

  const schema = useMemo(() => createVolunteerProfileSchema(t), [t]);

  const { control, handleSubmit, reset, trigger, formState } = useForm<VolunteerProfileFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      languages: formatLanguages(volunteer.languages, languageMapping.titleToIdLower),
      availability: apiToFormAvailability(volunteer.availability),
      districts: formatDistricts(volunteer.locations, districtMapping.titleToIdLower),
      volunteerType: getVolunteerTypeLabel(volunteer.statusType, t),
      activities: formatActivities(volunteer.activities, activityMapping.titleToIdLower),
      skills: formatSkills(volunteer.skills, skillMapping.titleToIdLower),
    },
  });

  const { errors, isValid, isDirty } = formState;

  useEffect(() => {
    if (!apiLanguages.length || !apiActivities.length || !apiSkills.length || !apiDistricts.length) return;

    reset({
      languages: formatLanguages(volunteer.languages, languageMapping.titleToIdLower),
      availability: apiToFormAvailability(volunteer.availability),
      districts: formatDistricts(volunteer.locations, districtMapping.titleToIdLower),
      volunteerType: getVolunteerTypeLabel(volunteer.statusType, t),
      activities: formatActivities(volunteer.activities, activityMapping.titleToIdLower),
      skills: formatSkills(volunteer.skills, skillMapping.titleToIdLower),
    });
    trigger();
    setIsEditing(false);
  }, [volunteer, reset, trigger, t, languageMapping, activityMapping, skillMapping, districtMapping]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (data: VolunteerProfileFormData) => {
    const labelToVolunteerType = Object.values(VolunteerStateTypeType).reduce(
      (acc, type) => {
        acc[t(`dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${type}`)] = type;
        return acc;
      },
      {} as Record<string, VolunteerStateTypeType>,
    );

    const statusType = labelToVolunteerType[data.volunteerType];

    const mapToApiItems = (ids: string[], mapping: { idToTitle: Record<number, string> }) =>
      ids
        .map((id) => {
          const numId = parseInt(id, 10);
          return { id: numId, title: mapping.idToTitle[numId] || "" };
        })
        .filter((item) => !isNaN(item.id) && item.id > 0);

    updateProfile(
      {
        // @ts-expect-error -- Need4Deed SDK types incorrect, 'id' should be number
        availability: formToApiAvailability(data.availability),
        ...(statusType && Object.values(VolunteerStateTypeType).includes(statusType) && { statusType }),
        languages: data.languages
          .filter((lang) => lang.language && lang.level)
          .map((lang) => ({
            id: parseInt(lang.language, 10),
            title: languageMapping.idToTitle[parseInt(lang.language, 10)] || "",
            proficiency: LEVEL_TO_PROFICIENCY[lang.level as LanguageLevel],
          })),
        locations: mapToApiItems(data.districts, districtMapping),
        activities: mapToApiItems(data.activities, activityMapping),
        skills: mapToApiItems(data.skills, skillMapping),
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const isApiDataLoading = !apiLanguages.length || !apiActivities.length || !apiSkills.length || !apiDistricts.length;

  return (
    <Container data-testid="volunteer-profile-section-container" $isEditing={isEditing}>
      <Header>
        <TitleRow>
          <IconContainer>
            <UserCircle size={40} weight="fill" />
          </IconContainer>
          <Heading2>{t("dashboard.volunteerProfile.profileSection.title")}</Heading2>
        </TitleRow>
        {!isEditing && (
          <Button
            text={t("dashboard.volunteerProfile.profileSection.edit")}
            onClick={handleEditClick}
            width="auto"
            padding="16px 24px"
            disabled={isApiDataLoading}
          />
        )}
      </Header>

      <Details>
        {isEditing ? (
          <FormFields
            control={control}
            errors={errors}
            t={t}
            i18n={i18n}
            locationOptions={apiDistricts.map((d) => d.title)}
            idToLabel={districtMapping.idToTitle}
            labelToId={districtMapping.titleToId}
            activitiesOptions={apiActivities.map((a) => a.title)}
            activityIdToLabel={activityMapping.idToTitle}
            activityLabelToId={activityMapping.titleToId}
            skillsOptions={apiSkills.map((s) => s.title)}
            skillIdToLabel={skillMapping.idToTitle}
            skillLabelToId={skillMapping.titleToId}
            languagesForForm={languagesForForm}
            trigger={trigger}
          />
        ) : (
          <DisplayFields
            languages={formatLanguagesForDisplay(volunteer.languages, languageMapping.idToTitle, t)}
            availability={formatAvailability(volunteer.availability)}
            districts={formatLocationsForDisplay(volunteer.locations)}
            volunteerType={getVolunteerTypeLabel(volunteer.statusType, t)}
            activities={extractTitles(volunteer.activities)}
            skills={extractTitles(volunteer.skills)}
            t={t}
          />
        )}
      </Details>

      {isEditing && (
        <ButtonRow>
          <Button
            text={t("dashboard.volunteerProfile.profileSection.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="16px 24px"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="2px solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.volunteerProfile.profileSection.saveChanges")}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            padding="16px 24px"
            disabled={!isDirty || !isValid || isPending}
          />
        </ButtonRow>
      )}
    </Container>
  );
}
