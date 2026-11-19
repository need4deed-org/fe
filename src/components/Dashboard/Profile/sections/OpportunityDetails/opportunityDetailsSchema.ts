import { Availability } from "@/components/forms/types";
import { LanguageLevel } from "@/types";
import {
  getTextLimitIssue,
  OpportunityTextLimits,
  SOURCE_TEXT_LIMITS,
  TextLimit,
} from "@/utils/opportunity-text-limits";
import { z } from "zod";
import { resolveFormLanguageToOption } from "./formatters";

const i18nPrefix = "dashboard.opportunityProfile.opportunityDetails.validation";

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

/** be's rule in the form: over the cap is an error, unless the text was already over it and isn't growing. */
export function refineTextLimit(t: Translate, limit: TextLimit, tooLongKey: string) {
  return (value: string, ctx: z.RefinementCtx) => {
    const issue = getTextLimitIssue(value, limit);
    if (!issue) return;
    ctx.addIssue({
      code: "custom",
      message:
        issue === "tooLong"
          ? t(tooLongKey, { max: limit.max })
          : t(`${i18nPrefix}.shortenOnly`, { max: limit.max, count: limit.allowed }),
    });
  };
}

export const createOpportunityDetailsSchema = (
  t: Translate,
  mainCommunicationLanguageOptions: MainCommunicationLanguageOption[] = [],
  limits: OpportunityTextLimits = SOURCE_TEXT_LIMITS,
) =>
  z.object({
    title: z
      .string()
      .min(1, t(`${i18nPrefix}.opportunityNameRequired`))
      .superRefine(refineTextLimit(t, limits.title, `${i18nPrefix}.opportunityNameTooLong`)),
    description: z.string().superRefine(refineTextLimit(t, limits.description, `${i18nPrefix}.descriptionTooLong`)),
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
