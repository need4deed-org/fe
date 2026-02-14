import { Availability } from "@/components/forms/types";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { LanguageLevel } from "@/types";
import { z } from "zod";

const i18nPrefix = "dashboard.opportunityProfile.opportunityDetails.validation";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.nativeEnum(LanguageLevel), z.literal("")]),
});

const languagesValidator = (t: (key: string) => string) =>
  z
    .array(languageObjectSchema)
    .superRefine((languages, ctx) => {
      const hasCompleteRow = languages.some((lang) => lang.language !== "");
      if (!hasCompleteRow) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(`${i18nPrefix}.languageRequired`),
        });
      }
    });

export const createOpportunityDetailsSchema = (t: (key: string) => string) =>
  z.object({
    description: z
      .string()
      .min(1, t(`${i18nPrefix}.descriptionRequired`))
      .max(MAX_DESCRIPTION_LENGTH, t(`${i18nPrefix}.descriptionTooLong`)),
    numberOfVolunteers: z
      .string()
      .refine((val) => val !== "" && val !== "0", {
        message: t(`${i18nPrefix}.numberOfVolunteersRequired`),
      }),
    mainCommunication: languagesValidator(t),
    residentsSpeak: languagesValidator(t),
    availability: z.custom<Availability>(
      (data) => {
        if (!Array.isArray(data)) return false;
        return data.some((day) =>
          day.timeSlots.some((slot: { selected: boolean }) => slot.selected),
        );
      },
      t(`${i18nPrefix}.availabilityRequired`),
    ),
    activities: z
      .array(z.string())
      .min(1, t(`${i18nPrefix}.activitiesRequired`)),
    skills: z
      .array(z.string())
      .min(1, t(`${i18nPrefix}.skillsRequired`)),
  });

export type OpportunityDetailsFormData = z.infer<ReturnType<typeof createOpportunityDetailsSchema>>;
