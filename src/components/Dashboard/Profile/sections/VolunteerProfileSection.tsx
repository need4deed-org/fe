"use client";
import Button from "@/components/core/button/Button/Button";
import { Tags } from "@/components/core/common/Tags";
import { ErrorMessage } from "@/components/core/common";
import { EditableField } from "@/components/EditableField/EditableField";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { Availability } from "@/components/forms/types";
import { getScheduleState } from "@/components/forms/utils";
import { Heading2 } from "@/components/styled/text";
import { LanguageLevel, LanguageObject } from "@/types";
import { useUpdateVolunteerProfile } from "@/hooks/useUpdateVolunteerProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UsersFour } from "@phosphor-icons/react";
import { Availability as ApiAvailability, ApiVolunteerGet, ByDay, Hour, Lang, LangProficiency } from "need4deed-sdk";
import { useCallback, useEffect, useState } from "react";
import { Control, Controller, ControllerRenderProps, FieldErrors, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
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

const hourMap: Record<number, Hour> = {
  0: Hour.H00,
  1: Hour.H01,
  2: Hour.H02,
  3: Hour.H03,
  4: Hour.H04,
  5: Hour.H05,
  6: Hour.H06,
  7: Hour.H07,
  8: Hour.H08,
  9: Hour.H09,
  10: Hour.H10,
  11: Hour.H11,
  12: Hour.H12,
  13: Hour.H13,
  14: Hour.H14,
  15: Hour.H15,
  16: Hour.H16,
  17: Hour.H17,
  18: Hour.H18,
  19: Hour.H19,
  20: Hour.H20,
  21: Hour.H21,
  22: Hour.H22,
  23: Hour.H23,
  24: Hour.H24,
};

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

// Convert form Availability to API Availability[]
function formToApiAvailability(formAvailability: Availability): ApiAvailability[] {
  const result: ApiAvailability[] = [];
  let idCounter = 0;

  formAvailability.forEach((day) => {
    day.timeSlots.forEach((slot) => {
      if (slot.selected && day.weekday >= 1 && day.weekday <= 7) {
        const dayName = dayMap[day.weekday];
        const slotId = String(slot.id);
        const [startHourStr, endHourStr] = slotId.split("-");
        const startHourNum = parseInt(startHourStr, 10);
        const endHourNum = parseInt(endHourStr, 10);

        const startHour = hourMap[startHourNum];
        const endHour = hourMap[endHourNum];

        if (!startHour || !endHour) {
          console.warn(`Invalid hour mapping for slot ${slotId}`);
          return;
        }

        const now = new Date();
        const startDate = new Date(now);
        startDate.setHours(startHourNum, 0, 0, 0);
        const endDate = new Date(now);
        endDate.setHours(endHourNum, 0, 0, 0);

        result.push({
          id: idCounter.toString(),
          timeslotId: idCounter,
          description: "",
          start: startDate,
          end: endDate,
          day: dayName,
          daytime: [startHour, endHour],
        });
        idCounter++;
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
          <TagsWrapper>
            <Tags tags={activities} backgroundColor="var(--color-pink-100)" />
          </TagsWrapper>
        </FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.skills")}</FieldLabel>
        <FieldValue>
          <TagsWrapper>
            <Tags tags={skills} backgroundColor="var(--color-pink-50)" />
          </TagsWrapper>
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
};

function FormFields({ control, errors, t, i18n }: FormFieldsProps) {
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
            type="text"
            label={t("dashboard.volunteerProfile.profileSection.districts")}
            value={field.value}
            setValue={field.onChange}
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
            type="text"
            label={t("dashboard.volunteerProfile.profileSection.volunteerType")}
            value={field.value}
            setValue={field.onChange}
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
            type="text"
            label={t("dashboard.volunteerProfile.profileSection.activities")}
            value={field.value.join(", ")}
            setValue={(value) => {
              if (typeof value === "string") {
                field.onChange(value.split(", ").map((v: string) => v.trim()));
              }
            }}
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
            type="text"
            label={t("dashboard.volunteerProfile.profileSection.skills")}
            value={field.value.join(", ")}
            setValue={(value) => {
              if (typeof value === "string") {
                field.onChange(value.split(", ").map((v: string) => v.trim()));
              }
            }}
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

      return langs.map((lang, index) => ({
        id: index + 1,
        language: lang.title,
        level: proficiencyToLevel[lang.proficiency?.toLowerCase() || "native"] || LanguageLevel.NATIVE,
      }));
    },
    [volunteer],
  );

  // Format languages for display
  const formatLanguagesForDisplay = useCallback(
    (langs: typeof volunteer.languages): string => {
      if (!langs || langs.length === 0) return "English – native, French – fluent";
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

  const extractTitles = useCallback(
    (items: typeof volunteer.activities): string[] => {
      if (!items || items.length === 0) return [];
      return items.map((item) => item.title);
    },
    [volunteer],
  );

  const schema = createVolunteerProfileSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<VolunteerProfileFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      languages: formatLanguages(volunteer.languages),
      availability: apiToFormAvailability(volunteer.availability),
      districts: "Kreuzberg, Friedrichshain",
      volunteerType: "Accompanying",
      activities:
        extractTitles(volunteer.activities).length > 0 ? extractTitles(volunteer.activities) : ["Tutoring", "Daycare"],
      skills: extractTitles(volunteer.skills).length > 0 ? extractTitles(volunteer.skills) : ["Cooking", "Singing"],
    },
  });

  // Sync form when volunteer data changes (after refetch)
  useEffect(() => {
    reset({
      languages: formatLanguages(volunteer.languages),
      availability: apiToFormAvailability(volunteer.availability),
      districts: "Kreuzberg, Friedrichshain",
      volunteerType: "Accompanying",
      activities:
        extractTitles(volunteer.activities).length > 0 ? extractTitles(volunteer.activities) : ["Tutoring", "Daycare"],
      skills: extractTitles(volunteer.skills).length > 0 ? extractTitles(volunteer.skills) : ["Cooking", "Singing"],
    });
    setIsEditing(false);
  }, [volunteer, reset, formatLanguages, extractTitles]);

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
        availability: formToApiAvailability(data.availability),
        languages: data.languages
          .filter((lang) => lang.language)
          .map((lang) => ({
            title: lang.language,
            proficiency: levelToProficiency[lang.level],
          })),
        // TODO: Convert other form data back to API format
        // activities: data.activities,
        // skills: data.skills,
        // locations: data.districts,
      },
      {
        onSuccess: () => {
          reset(data);
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <Container data-testid="volunteer-profile-section-container" $isEditing={isEditing}>
      <Header>
        <TitleRow>
          <IconContainer>
            <User size={40} weight="fill" />
          </IconContainer>
          <Heading2>{t("dashboard.volunteerProfile.profileSection.title")}</Heading2>
        </TitleRow>
        {!isEditing && (
          <Button
            text={t("dashboard.volunteerProfile.profileSection.edit")}
            onClick={handleEditClick}
            width="auto"
            padding="16px 24px"
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
          />
        ) : (
          <DisplayFields
            languages={formatLanguagesForDisplay(volunteer.languages)}
            availability={formatAvailability(volunteer.availability)}
            districts="Kreuzberg, Friedrichshain"
            volunteerType="Accompanying"
            activities={
              extractTitles(volunteer.activities).length > 0
                ? extractTitles(volunteer.activities)
                : ["Tutoring", "Daycare"]
            }
            skills={
              extractTitles(volunteer.skills).length > 0 ? extractTitles(volunteer.skills) : ["Cooking", "Singing"]
            }
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
            disabled={!isValid || isPending}
          />
        </ButtonRow>
      )}
    </Container>
  );
}
