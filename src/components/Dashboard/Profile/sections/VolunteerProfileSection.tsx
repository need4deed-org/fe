"use client";
import Button from "@/components/core/button/Button/Button";
import { ErrorMessage } from "@/components/core/common";
import { Tags } from "@/components/core/common/Tags";
import { EditableField } from "@/components/EditableField/EditableField";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { Availability } from "@/components/forms/types";
import { getScheduleState } from "@/components/forms/utils";
import { Heading2 } from "@/components/styled/text";
import { apiPathOption } from "@/config/constants";
import { useUpdateVolunteerProfile } from "@/hooks/useUpdateVolunteerProfile";
import { LanguageLevel, LanguageObject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle, UsersFour } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { TFunction } from "i18next";
import {
  Availability as ApiAvailability,
  ApiVolunteerGet,
  ByDay,
  Lang,
  LangProficiency,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Control, Controller, ControllerRenderProps, FieldErrors, useForm, UseFormTrigger } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

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

const FieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: 32px;
  padding: 16px 0;
  border-bottom: none;

  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: var(--color-midnight);
  width: 220px;
  flex-shrink: 0;
`;

const FieldValue = styled.div`
  font-size: 20px;
  color: var(--color-midnight);
  flex: 1;
  line-height: 1.5;
`;

const VolunteerTypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--color-blue-500);
  color: var(--color-white);
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const LanguageFieldsWrapper = styled.div`
  margin-bottom: 8px;
`;

interface Props {
  volunteer: ApiVolunteerGet;
}

// Day mapping: weekday number to ByDay enum
const dayMap: Record<number, ByDay> = {
  1: ByDay.MO,
  2: ByDay.TU,
  3: ByDay.WE,
  4: ByDay.TH,
  5: ByDay.FR,
  6: ByDay.SA,
  7: ByDay.SU,
};

const reverseDayMap: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

type ApiLanguageOption = {
  id: number;
  title: string;
  isoCode?: string;
};

// Hook to fetch languages from API
function useApiLanguages(currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: ["languages", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/language?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch languages");
      const data = await response.json();
      return data.data.language || [];
    },
    staleTime: Infinity,
  });
}

// Hook to fetch activities from API
function useApiActivities(currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: ["activities", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/activity?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      return data.data.activity || [];
    },
    staleTime: Infinity,
  });
}

// Hook to fetch skills from API
function useApiSkills(currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: ["skills", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/skill?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      return data.data.skill || [];
    },
    staleTime: Infinity,
  });
}

// Hook to fetch districts from API
function useApiDistricts(currentLanguage: Lang) {
  return useQuery<ApiLanguageOption[]>({
    queryKey: ["districts", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`${apiPathOption}/district?language=${currentLanguage}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch districts");
      const data = await response.json();
      return data.data.district || [];
    },
    staleTime: Infinity,
  });
}

// Convert API Availability[] to form Availability
function apiToFormAvailability(apiAvailability: ApiAvailability[]): Availability {
  const formAvailability = getScheduleState();

  apiAvailability.forEach((avail) => {
    const weekdayNum = reverseDayMap[avail.day as string];
    if (!weekdayNum) return;

    const dayIndex = formAvailability.findIndex((d) => d.weekday === weekdayNum);
    if (dayIndex === -1) return;

    // Extract time slot from daytime (e.g., ["8:00", "11:00"] -> "08-11")
    if (Array.isArray(avail.daytime) && avail.daytime.length === 2) {
      const [start, end] = avail.daytime;
      const startHour = start.split(":")[0].padStart(2, "0");
      const endHour = end.split(":")[0].padStart(2, "0");
      const timeSlotId = `${startHour}-${endHour}`;

      const slotIndex = formAvailability[dayIndex].timeSlots.findIndex((s) => s.id === timeSlotId);
      if (slotIndex !== -1) {
        formAvailability[dayIndex].timeSlots[slotIndex].selected = true;
      }
    }
  });

  return formAvailability;
}

// Convert form Availability to backend format
function formToApiAvailability(formAvailability: Availability): Array<{ day: string; daytime: [string, string] }> {
  const result: Array<{ day: string; daytime: [string, string] }> = [];

  const dayEnumToString: Record<ByDay, string> = {
    [ByDay.MO]: "Monday",
    [ByDay.TU]: "Tuesday",
    [ByDay.WE]: "Wednesday",
    [ByDay.TH]: "Thursday",
    [ByDay.FR]: "Friday",
    [ByDay.SA]: "Saturday",
    [ByDay.SU]: "Sunday",
  };

  formAvailability.forEach((day) => {
    day.timeSlots.forEach((slot) => {
      if (slot.selected && day.weekday >= 1 && day.weekday <= 7) {
        const dayEnum = dayMap[day.weekday];
        const dayString = dayEnumToString[dayEnum];
        const slotId = String(slot.id);
        const [startHourStr, endHourStr] = slotId.split("-");
        const startHourNum = parseInt(startHourStr, 10);
        const endHourNum = parseInt(endHourStr, 10);

        const startTime = `${startHourNum}:00`;
        const endTime = `${endHourNum}:00`;

        result.push({
          day: dayString,
          daytime: [startTime, endTime],
        });
      }
    });
  });

  return result;
}

type DisplayFieldsProps = {
  languages: string;
  availability: string;
  districts: string;
  volunteerType: string;
  activities: string[];
  skills: string[];
  t: (key: string) => string;
};

function DisplayFields({
  languages,
  availability,
  districts,
  volunteerType,
  activities,
  skills,
  t,
}: DisplayFieldsProps) {
  return (
    <>
      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.languages")}</FieldLabel>
        <FieldValue>{languages}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.availability")}</FieldLabel>
        <FieldValue>{availability}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.districts")}</FieldLabel>
        <FieldValue>{districts}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.volunteerType")}</FieldLabel>
        <FieldValue>
          <VolunteerTypeBadge>
            <UsersFour size={20} weight="fill" />
            {volunteerType}
          </VolunteerTypeBadge>
        </FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.activities")}</FieldLabel>
        <FieldValue>
          {activities.length > 0 ? (
            <TagsWrapper>
              <Tags tags={activities} backgroundColor="var(--color-pink-100)" />
            </TagsWrapper>
          ) : (
            "–"
          )}
        </FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.skills")}</FieldLabel>
        <FieldValue>
          {skills.length > 0 ? (
            <TagsWrapper>
              <Tags tags={skills} backgroundColor="var(--color-pink-50)" />
            </TagsWrapper>
          ) : (
            "–"
          )}
        </FieldValue>
      </FieldRow>
    </>
  );
}

type FormFieldsProps = {
  control: Control<VolunteerProfileFormData>;
  errors: FieldErrors<VolunteerProfileFormData>;
  t: TFunction<"translation", undefined>;
  i18n: { language: string };
  locationOptions: string[];
  idToLabel: Record<string | number, string>;
  labelToId: Record<string, string | number>;
  activitiesOptions: string[];
  activityIdToLabel: Record<string | number, string>;
  activityLabelToId: Record<string, string | number>;
  skillsOptions: string[];
  skillIdToLabel: Record<string | number, string>;
  skillLabelToId: Record<string, string | number>;
  languagesForForm: Array<{ id: number | string; title: Record<Lang, string> }>;
  trigger: UseFormTrigger<VolunteerProfileFormData>;
};

function FormFields({
  control,
  errors,
  t,
  i18n,
  locationOptions,
  idToLabel,
  labelToId,
  activitiesOptions,
  activityIdToLabel,
  activityLabelToId,
  skillsOptions,
  skillIdToLabel,
  skillLabelToId,
  languagesForForm,
  trigger,
}: FormFieldsProps) {
  return (
    <>
      <Controller
        name="languages"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "languages"> }) => (
          <FieldRow>
            <FieldLabel>{t("dashboard.volunteerProfile.profileSection.languages")}:</FieldLabel>
            <FieldValue>
              <LanguageFieldsWrapper>
                <LanguageFields
                  languages={field.value}
                  onChange={field.onChange}
                  t={t}
                  availableLanguages={languagesForForm}
                />
              </LanguageFieldsWrapper>
              {errors.languages?.message && <ErrorMessage message={errors.languages.message} />}
            </FieldValue>
          </FieldRow>
        )}
      />

      <Controller
        name="availability"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "availability"> }) => (
          <FieldRow>
            <FieldLabel>{t("dashboard.volunteerProfile.profileSection.availability")}:</FieldLabel>
            <FieldValue>
              <AvailabilityGrid
                availability={field.value}
                onChange={field.onChange}
                t={t}
                currentLanguage={i18n.language as Lang}
              />
              {errors.availability?.message && <ErrorMessage message={errors.availability.message} />}
            </FieldValue>
          </FieldRow>
        )}
      />

      <Controller
        name="districts"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "districts"> }) => (
          <EditableField
            mode="edit"
            type="checkbox-list"
            label={t("dashboard.volunteerProfile.profileSection.districts")}
            value={field.value.map((id) => idToLabel[id] || String(id))}
            setValue={(value) => {
              const labels = Array.isArray(value) ? value : [value];
              field.onChange(labels.map((label) => String(labelToId[label])));
              trigger("districts");
            }}
            options={locationOptions}
            errorMessage={errors.districts?.message}
          />
        )}
      />

      <Controller
        name="volunteerType"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "volunteerType"> }) => (
          <EditableField
            mode="edit"
            type="radio-list"
            label={t("dashboard.volunteerProfile.profileSection.volunteerType")}
            value={field.value}
            setValue={field.onChange}
            options={[
              t(
                `dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${VolunteerStateTypeType.ACCOMPANYING}`,
              ),
              t(`dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${VolunteerStateTypeType.REGULAR}`),
              t(`dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${VolunteerStateTypeType.EVENTS}`),
            ]}
            errorMessage={errors.volunteerType?.message}
          />
        )}
      />

      <Controller
        name="activities"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "activities"> }) => (
          <EditableField
            mode="edit"
            type="checkbox-list"
            label={t("dashboard.volunteerProfile.profileSection.activities")}
            value={field.value.map((id) => activityIdToLabel[id] || String(id))}
            setValue={(value) => {
              const labels = Array.isArray(value) ? value : [value];
              field.onChange(labels.map((label) => String(activityLabelToId[label])));
              trigger("activities");
            }}
            options={activitiesOptions}
            errorMessage={errors.activities?.message}
          />
        )}
      />

      <Controller
        name="skills"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "skills"> }) => (
          <EditableField
            mode="edit"
            type="checkbox-list"
            label={t("dashboard.volunteerProfile.profileSection.skills")}
            value={field.value.map((id) => skillIdToLabel[id] || String(id))}
            setValue={(value) => {
              const labels = Array.isArray(value) ? value : [value];
              field.onChange(labels.map((label) => String(skillLabelToId[label])));
              trigger("skills");
            }}
            options={skillsOptions}
            errorMessage={errors.skills?.message}
          />
        )}
      />
    </>
  );
}

export function VolunteerProfileSection({ volunteer }: Props) {
  const { t, i18n } = useTranslation();
  const { mutate: updateProfile, isPending } = useUpdateVolunteerProfile(volunteer.id);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch options from API
  const { data: apiLanguages = [] } = useApiLanguages(i18n.language as Lang);
  const { data: apiActivities = [] } = useApiActivities(i18n.language as Lang);
  const { data: apiSkills = [] } = useApiSkills(i18n.language as Lang);
  const { data: apiDistricts = [] } = useApiDistricts(i18n.language as Lang);

  // Create a lookup map from volunteer's language titles to database IDs
  const languageTitleToDbId = useMemo(() => {
    const map: Record<string, number> = {};
    apiLanguages.forEach((lang) => {
      map[lang.title.toLowerCase()] = lang.id;
    });
    return map;
  }, [apiLanguages]);

  // Create activity title to ID and ID to title mappings
  const activityTitleToDbId = useMemo(() => {
    const map: Record<string, number> = {};
    apiActivities.forEach((act) => {
      map[act.title.toLowerCase()] = act.id;
    });
    return map;
  }, [apiActivities]);

  const activityIdToTitle = useMemo(() => {
    const map: Record<number, string> = {};
    apiActivities.forEach((act) => {
      map[act.id] = act.title;
    });
    return map;
  }, [apiActivities]);

  // Create skill title to ID and ID to title mappings
  const skillTitleToDbId = useMemo(() => {
    const map: Record<string, number> = {};
    apiSkills.forEach((skill) => {
      map[skill.title.toLowerCase()] = skill.id;
    });
    return map;
  }, [apiSkills]);

  const skillIdToTitle = useMemo(() => {
    const map: Record<number, string> = {};
    apiSkills.forEach((skill) => {
      map[skill.id] = skill.title;
    });
    return map;
  }, [apiSkills]);

  // Create district title to ID and ID to title mappings
  const districtTitleToDbId = useMemo(() => {
    const map: Record<string, number> = {};
    apiDistricts.forEach((district) => {
      map[district.title.toLowerCase()] = district.id;
    });
    return map;
  }, [apiDistricts]);

  const districtIdToTitle = useMemo(() => {
    const map: Record<number, string> = {};
    apiDistricts.forEach((district) => {
      map[district.id] = district.title;
    });
    return map;
  }, [apiDistricts]);

  // Convert API languages to the format expected by LanguageFieldRow
  const languagesForForm = useMemo(() => {
    return apiLanguages.map((lang) => ({
      id: lang.id,
      title: { [i18n.language as Lang]: lang.title } as Record<Lang, string>,
    }));
  }, [apiLanguages, i18n.language]);

  const locationOptions = apiDistricts.map((district) => district.title);

  const idToLabel: Record<string | number, string> = {};
  const labelToId: Record<string, string | number> = {};
  apiDistricts.forEach((district) => {
    idToLabel[district.id] = district.title;
    labelToId[district.title] = district.id;
  });

  const activitiesOptions = apiActivities.map((activity) => activity.title);

  const activityIdToLabel: Record<string | number, string> = {};
  const activityLabelToId: Record<string, string | number> = {};
  apiActivities.forEach((activity) => {
    activityIdToLabel[activity.id] = activity.title;
    activityLabelToId[activity.title] = activity.id;
  });

  const skillsOptions = apiSkills.map((skill) => skill.title);

  const skillIdToLabel: Record<string | number, string> = {};
  const skillLabelToId: Record<string, string | number> = {};
  apiSkills.forEach((skill) => {
    skillIdToLabel[skill.id] = skill.title;
    skillLabelToId[skill.title] = skill.id;
  });

  // Create ID to title mapping for display
  const languageIdToTitle = useMemo(() => {
    const map: Record<number, string> = {};
    apiLanguages.forEach((lang) => {
      map[lang.id] = lang.title;
    });
    return map;
  }, [apiLanguages]);

  // Transform API languages to form format
  const formatLanguages = useCallback(
    (langs: typeof volunteer.languages): LanguageObject[] => {
      if (!langs || langs.length === 0) {
        return [{ id: 1, language: "", level: "" }];
      }

      const proficiencyToLevel: Record<string, LanguageLevel> = {
        native: LanguageLevel.NATIVE,
        fluent: LanguageLevel.FLUENT,
        intermediate: LanguageLevel.INTERMEDIATE,
        advanced: LanguageLevel.FLUENT,
        beginner: LanguageLevel.INTERMEDIATE,
      };

      return langs.map((lang) => {
        // Find the database ID by matching the title (case-insensitive)
        const dbId = languageTitleToDbId[lang.title.toLowerCase()] || lang.id;

        return {
          id: lang.id,
          language: String(dbId),
          level: proficiencyToLevel[lang.proficiency?.toLowerCase() || "native"] || LanguageLevel.NATIVE,
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [languageTitleToDbId],
  );

  // Format activities for form - convert from API response to form IDs
  const formatActivities = useCallback(
    (activities: typeof volunteer.activities): string[] => {
      if (!activities || activities.length === 0) return [];
      return activities
        .map((act) => {
          // Try to match by title first, fallback to direct ID
          const dbId = activityTitleToDbId[act.title.toLowerCase()] || act.id;
          return String(dbId);
        })
        .filter((id) => id && id !== "0");
    },
    [activityTitleToDbId, volunteer],
  );

  // Format skills for form - convert from API response to form IDs
  const formatSkills = useCallback(
    (skills: typeof volunteer.skills): string[] => {
      if (!skills || skills.length === 0) return [];
      return skills
        .map((skill) => {
          // Try to match by title first, fallback to direct ID
          const dbId = skillTitleToDbId[skill.title.toLowerCase()] || skill.id;
          return String(dbId);
        })
        .filter((id) => id && id !== "0");
    },
    [skillTitleToDbId, volunteer],
  );

  // Format districts for form - convert from API response to form IDs
  const formatDistricts = useCallback(
    (locations: typeof volunteer.locations): string[] => {
      if (!locations || locations.length === 0) return [];
      return locations
        .map((loc) => {
          // Try to match by title first, fallback to direct ID
          const dbId = districtTitleToDbId[loc.title.toLowerCase()] || loc.id;
          return String(dbId);
        })
        .filter((id) => id && id !== "0");
    },
    [districtTitleToDbId, volunteer],
  );

  // Format languages for display
  const formatLanguagesForDisplay = useCallback(
    (langs: typeof volunteer.languages): string => {
      if (!langs || langs.length === 0) return "–";
      return langs
        .map((lang) => {
          const proficiency = lang.proficiency ? ` – ${lang.proficiency}` : "";
          return `${lang.title}${proficiency}`;
        })
        .join(", ");
    },
    [volunteer],
  );

  const formatAvailability = useCallback(
    (avails: typeof volunteer.availability): string => {
      if (!avails || avails.length === 0) {
        const defaultSchedule = getScheduleState();
        const hasSelectedSlots = defaultSchedule.some((day) => day.timeSlots.some((slot) => slot.selected));
        if (!hasSelectedSlots) return "No availability set";
      }

      // Group by time slots
      const timeSlotGroups = new Map<string, string[]>();

      avails.forEach((avail) => {
        const dayName = avail.day === "occasionally" ? "Occasionally" : avail.day;
        const timeKey =
          Array.isArray(avail.daytime) && avail.daytime.length === 2
            ? `${avail.daytime[0]}-${avail.daytime[1]}`
            : avail.daytime[0] || "";

        if (!timeSlotGroups.has(timeKey)) {
          timeSlotGroups.set(timeKey, []);
        }
        timeSlotGroups.get(timeKey)?.push(dayName);
      });

      // Format each time slot group
      const formatted = Array.from(timeSlotGroups.entries()).map(([time, days]) => {
        const daysStr = days.join(" & ");
        return time ? `${daysStr}, ${time}` : daysStr;
      });

      return formatted.join("; ");
    },
    [volunteer],
  );

  const extractTitles = useCallback((items: { title: string }[]): string[] => {
    if (!items || items.length === 0) return [];
    return items.map((item) => item.title);
  }, []);

  const getVolunteerTypeLabel = useCallback(
    (statusType: VolunteerStateTypeType | undefined): string => {
      if (!statusType) return t("dashboard.volunteerProfile.volunteerHeader.volunteerType_options.regular");
      return t(`dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${statusType}`);
    },
    [t],
  );

  const formatLocationsForDisplay = useCallback(
    (locations: typeof volunteer.locations): string => {
      if (!locations || locations.length === 0) return "–";
      return locations.map((loc) => loc.title).join(", ");
    },
    [volunteer],
  );

  const schema = createVolunteerProfileSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState,
  } = useForm<VolunteerProfileFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      languages: formatLanguages(volunteer.languages),
      availability: apiToFormAvailability(volunteer.availability),
      districts: formatDistricts(volunteer.locations),
      volunteerType: getVolunteerTypeLabel(volunteer.statusType),
      activities: formatActivities(volunteer.activities),
      skills: formatSkills(volunteer.skills),
    },
  });

  const { errors, isValid, isDirty } = formState;


  // Sync form when volunteer data changes (after refetch) OR when API data loads
  useEffect(() => {
    // Wait for API data to load before resetting form
    if (
      apiLanguages.length === 0 ||
      apiActivities.length === 0 ||
      apiSkills.length === 0 ||
      apiDistricts.length === 0
    ) {
      return;
    }

    reset({
      languages: formatLanguages(volunteer.languages),
      availability: apiToFormAvailability(volunteer.availability),
      districts: formatDistricts(volunteer.locations),
      volunteerType: getVolunteerTypeLabel(volunteer.statusType),
      activities: formatActivities(volunteer.activities),
      skills: formatSkills(volunteer.skills),
    });
    // Trigger validation after reset to update isValid state
    trigger();
    setIsEditing(false);
  }, [
    volunteer,
    reset,
    trigger,
    formatLanguages,
    formatActivities,
    formatSkills,
    formatDistricts,
    getVolunteerTypeLabel,
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

    updateProfile(
      {
        // Cast to any - SDK types expect Hour enums but backend actually expects time strings
        availability: formToApiAvailability(data.availability) as any,
        languages: data.languages
          .filter(
            (lang): lang is LanguageObject & { level: LanguageLevel } => lang.language !== "" && lang.level !== "",
          )
          .map((lang) => {
            const dbId = parseInt(lang.language, 10);
            const languageTitle = languageIdToTitle[dbId] || "";

            return {
              id: dbId,
              title: languageTitle,
              proficiency: levelToProficiency[lang.level],
            };
          }),
        locations: data.districts
          .map((districtId) => {
            const dbId = parseInt(districtId, 10);
            const districtTitle = districtIdToTitle[dbId] || "";

            return {
              id: dbId,
              title: districtTitle,
            };
          })
          .filter((loc) => !isNaN(loc.id) && loc.id > 0),
        activities: data.activities
          .map((activityId) => {
            const dbId = parseInt(activityId, 10);
            const activityTitle = activityIdToTitle[dbId] || "";

            return {
              id: dbId,
              title: activityTitle,
            };
          })
          .filter((act) => !isNaN(act.id) && act.id > 0),
        skills: data.skills
          .map((skillId) => {
            const dbId = parseInt(skillId, 10);
            const skillTitle = skillIdToTitle[dbId] || "";

            return {
              id: dbId,
              title: skillTitle,
            };
          })
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
            idToLabel={idToLabel}
            labelToId={labelToId}
            activitiesOptions={activitiesOptions}
            activityIdToLabel={activityIdToLabel}
            activityLabelToId={activityLabelToId}
            skillsOptions={skillsOptions}
            skillIdToLabel={skillIdToLabel}
            skillLabelToId={skillLabelToId}
            languagesForForm={languagesForForm}
            trigger={trigger}
          />
        ) : (
          <DisplayFields
            languages={formatLanguagesForDisplay(volunteer.languages)}
            availability={formatAvailability(volunteer.availability)}
            districts={formatLocationsForDisplay(volunteer.locations)}
            volunteerType={getVolunteerTypeLabel(volunteer.statusType)}
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
