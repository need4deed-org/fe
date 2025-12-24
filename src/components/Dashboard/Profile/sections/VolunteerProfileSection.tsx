"use client";
import Button from "@/components/core/button/Button/Button";
import { Heading2 } from "@/components/styled/text";
import { useUpdateVolunteerProfile } from "@/hooks/useUpdateVolunteerProfile";
import { LanguageLevel } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle } from "@phosphor-icons/react";
import { ApiVolunteerGet, Lang, LangProficiency, VolunteerStateTypeType } from "need4deed-sdk";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { apiToFormAvailability, formToApiAvailability } from "./VolunteerProfileSection/availabilityUtils";
import { DisplayFields } from "./VolunteerProfileSection/DisplayFields";
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
} from "./VolunteerProfileSection/formatters";
import { FormFields } from "./VolunteerProfileSection/FormFields";
import { useApiActivities, useApiDistricts, useApiLanguages, useApiSkills } from "./VolunteerProfileSection/hooks";
import {
  createBiDirectionalMapping,
  createIdToTitleMap,
  createTitleToIdMap,
} from "./VolunteerProfileSection/mappingUtils";
import {
  createVolunteerProfileSchema,
  VolunteerProfileFormData,
} from "./VolunteerProfileSection/volunteerProfileSchema";

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

  const languageTitleToDbId = useMemo(() => createTitleToIdMap(apiLanguages), [apiLanguages]);
  const languageIdToTitle = useMemo(() => createIdToTitleMap(apiLanguages), [apiLanguages]);
  const activityTitleToDbId = useMemo(() => createTitleToIdMap(apiActivities), [apiActivities]);
  const activityIdToTitle = useMemo(() => createIdToTitleMap(apiActivities), [apiActivities]);
  const skillTitleToDbId = useMemo(() => createTitleToIdMap(apiSkills), [apiSkills]);
  const skillIdToTitle = useMemo(() => createIdToTitleMap(apiSkills), [apiSkills]);
  const districtTitleToDbId = useMemo(() => createTitleToIdMap(apiDistricts), [apiDistricts]);
  const districtIdToTitle = useMemo(() => createIdToTitleMap(apiDistricts), [apiDistricts]);

  const languagesForForm = useMemo(() => {
    return apiLanguages.map((lang) => ({
      id: lang.id,
      title: { [i18n.language as Lang]: lang.title } as Record<Lang, string>,
    }));
  }, [apiLanguages, i18n.language]);

  const locationOptions = useMemo(() => apiDistricts.map((district) => district.title), [apiDistricts]);
  const activitiesOptions = useMemo(() => apiActivities.map((activity) => activity.title), [apiActivities]);
  const skillsOptions = useMemo(() => apiSkills.map((skill) => skill.title), [apiSkills]);

  const districtMapping = useMemo(() => createBiDirectionalMapping(apiDistricts), [apiDistricts]);
  const activityMapping = useMemo(() => createBiDirectionalMapping(apiActivities), [apiActivities]);
  const skillMapping = useMemo(() => createBiDirectionalMapping(apiSkills), [apiSkills]);

  const schema = useMemo(() => createVolunteerProfileSchema(t), [t]);

  const { control, handleSubmit, reset, trigger, formState } = useForm<VolunteerProfileFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      languages: formatLanguages(volunteer.languages, languageTitleToDbId),
      availability: apiToFormAvailability(volunteer.availability),
      districts: formatDistricts(volunteer.locations, districtTitleToDbId),
      volunteerType: getVolunteerTypeLabel(volunteer.statusType, t),
      activities: formatActivities(volunteer.activities, activityTitleToDbId),
      skills: formatSkills(volunteer.skills, skillTitleToDbId),
    },
  });

  const { errors, isValid, isDirty } = formState;

  useEffect(() => {
    if (
      apiLanguages.length === 0 ||
      apiActivities.length === 0 ||
      apiSkills.length === 0 ||
      apiDistricts.length === 0
    ) {
      return;
    }

    reset({
      languages: formatLanguages(volunteer.languages, languageTitleToDbId),
      availability: apiToFormAvailability(volunteer.availability),
      districts: formatDistricts(volunteer.locations, districtTitleToDbId),
      volunteerType: getVolunteerTypeLabel(volunteer.statusType, t),
      activities: formatActivities(volunteer.activities, activityTitleToDbId),
      skills: formatSkills(volunteer.skills, skillTitleToDbId),
    });
    trigger();
    setIsEditing(false);
  }, [
    volunteer,
    reset,
    trigger,
    t,
    languageTitleToDbId,
    activityTitleToDbId,
    skillTitleToDbId,
    districtTitleToDbId,
    apiLanguages,
    apiActivities,
    apiSkills,
    apiDistricts,
  ]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (data: VolunteerProfileFormData) => {
    const levelToProficiency: Record<LanguageLevel, LangProficiency> = {
      [LanguageLevel.NATIVE]: LangProficiency.NATIVE,
      [LanguageLevel.FLUENT]: LangProficiency.FLUENT,
      [LanguageLevel.INTERMEDIATE]: LangProficiency.INTERMEDIATE,
    };

    const labelToVolunteerType = Object.values(VolunteerStateTypeType).reduce(
      (acc, type) => {
        acc[t(`dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${type}`)] = type;
        return acc;
      },
      {} as Record<string, VolunteerStateTypeType>,
    );

    const statusType = labelToVolunteerType[data.volunteerType];
    const isValidStatusType = statusType && Object.values(VolunteerStateTypeType).includes(statusType);

    updateProfile(
      {
        availability: formToApiAvailability(data.availability),
        ...(isValidStatusType ? { statusType } : {}),
        languages: data.languages
          .filter((lang) => lang.language !== "" && lang.level !== "")
          .map((lang) => ({
            id: parseInt(lang.language, 10),
            title: languageIdToTitle[parseInt(lang.language, 10)] || "",
            proficiency: levelToProficiency[lang.level as LanguageLevel],
          })),
        locations: data.districts
          .map((districtId) => ({
            id: parseInt(districtId, 10),
            title: districtIdToTitle[parseInt(districtId, 10)] || "",
          }))
          .filter((loc) => !isNaN(loc.id) && loc.id > 0),
        activities: data.activities
          .map((activityId) => ({
            id: parseInt(activityId, 10),
            title: activityIdToTitle[parseInt(activityId, 10)] || "",
          }))
          .filter((act) => !isNaN(act.id) && act.id > 0),
        skills: data.skills
          .map((skillId) => ({
            id: parseInt(skillId, 10),
            title: skillIdToTitle[parseInt(skillId, 10)] || "",
          }))
          .filter((s) => !isNaN(s.id) && s.id > 0),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const isApiDataLoading =
    apiLanguages.length === 0 || apiActivities.length === 0 || apiSkills.length === 0 || apiDistricts.length === 0;

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
            locationOptions={locationOptions}
            idToLabel={districtMapping.idToLabel}
            labelToId={districtMapping.labelToId}
            activitiesOptions={activitiesOptions}
            activityIdToLabel={activityMapping.idToLabel}
            activityLabelToId={activityMapping.labelToId}
            skillsOptions={skillsOptions}
            skillIdToLabel={skillMapping.idToLabel}
            skillLabelToId={skillMapping.labelToId}
            languagesForForm={languagesForForm}
            trigger={trigger}
          />
        ) : (
          <DisplayFields
            languages={formatLanguagesForDisplay(volunteer.languages, languageIdToTitle, t)}
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
