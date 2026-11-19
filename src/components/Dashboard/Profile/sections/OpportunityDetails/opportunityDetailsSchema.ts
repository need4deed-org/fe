import { Availability } from "@/components/forms/types";
import { LanguageLevel } from "@/types";
import { OpportunityTextLimits, refineTextLimit, SOURCE_TEXT_LIMITS } from "@/utils/opportunity-text-limits";
import { z } from "zod";
import { resolveFormLanguageToOption } from "./formatters";

export const i18nPrefix = "dashboard.opportunityProfile.opportunityDetails.validation";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.nativeEnum(LanguageLevel), z.literal("")]),
});

type MainCommunicationLanguageOption = { id: number; title: string; isoCode?: string };

function toLangCode(option: MainCommunicationLanguageOption): "de" | "en" | null {
  if (option.isoCode === "de") return "de";
  if (option.isoCode === "en") return "en";
  const title = option.title.toLowerCase();
  if (["german", "deutsch"].includes(title)) return "de";
  if (["english", "englisch"].includes(title)) return "en";
  return null;
}

export function getMainCommunicationLanguageOptions<T extends MainCommunicationLanguageOption>(apiLanguages: T[]): T[] {
  return apiLanguages.filter((l) => toLangCode(l) !== null);
}

type Translate = (key: string, options?: Record<string, unknown>) => string;

export const lengthMessages = (tooLongKey: string) => ({
  tooLong: tooLongKey,
  shortenOnly: `${i18nPrefix}.shortenOnly`,
});

export const createOpportunityDetailsSchema = (
  t: Translate,
  mainCommunicationLanguageOptions: MainCommunicationLanguageOption[] = [],
  limits: OpportunityTextLimits = SOURCE_TEXT_LIMITS,
) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, t(`${i18nPrefix}.opportunityNameRequired`))
      .superRefine(refineTextLimit(t, limits.title, lengthMessages(`${i18nPrefix}.opportunityNameTooLong`))),
    description: z
      .string()
      .superRefine(refineTextLimit(t, limits.description, lengthMessages(`${i18nPrefix}.descriptionTooLong`))),
    numberOfVolunteers: z.string(),
    mainCommunication: z.array(languageObjectSchema).superRefine((langs, ctx) => {
      const selected = langs.filter(({ language }) => !!language);
      if (selected.length === 0) return;

      const resolved = selected.map(({ language }) =>
        resolveFormLanguageToOption(language, mainCommunicationLanguageOptions, t),
      );
      const hasUnresolved = resolved.some((option) => !option);
      const codes = new Set(
        resolved.filter((option): option is MainCommunicationLanguageOption => !!option).map(toLangCode),
      );

      const isOnlyGermanOrEnglish = codes.size > 0 && Array.from(codes).every((code) => code === "de" || code === "en");
      if (hasUnresolved || codes.has(null) || !isOnlyGermanOrEnglish) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(`${i18nPrefix}.mainCommunicationInvalid`),
        });
      }
    }),
    residentsSpeak: z.array(languageObjectSchema),
    availability: z.custom<Availability>().nullable().optional(),
    eventDate: z.date().nullable().optional(),
    eventTime: z.string().optional(),
    activities: z.array(z.string()),
    skills: z.array(z.string()),
  });

export type OpportunityDetailsFormData = z.infer<ReturnType<typeof createOpportunityDetailsSchema>>;

export const createNewOpportunityDetailsSchema = (
  t: Translate,
  mainCommunicationLanguageOptions: MainCommunicationLanguageOption[] = [],
) => createOpportunityDetailsSchema(t, mainCommunicationLanguageOptions).omit({ title: true });

export type NewOpportunityDetailsFormData = z.infer<ReturnType<typeof createNewOpportunityDetailsSchema>>;
