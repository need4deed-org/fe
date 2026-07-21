import { Availability } from "@/components/forms/types";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { LanguageLevel } from "@/types";
import { z } from "zod";
import { resolveFormLanguageToOption } from "./formatters";

const i18nPrefix = "dashboard.opportunityProfile.opportunityDetails.validation";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.nativeEnum(LanguageLevel), z.literal("")]),
});

type MainCommunicationLanguageOption = { id: number; title: string; isoCode?: string };

// isoCode is preferred when the option supplies it — `title` is whatever the
// option list was translated into (e.g. "Deutsch"/"Englisch" for a German
// request), never reliably the literal English words "german"/"english", so
// title matching is only a fallback for callers/tests that omit isoCode.
const isGermanOption = (l: MainCommunicationLanguageOption): boolean =>
  l.isoCode ? l.isoCode === "de" : l.title.toLowerCase() === "german";
const isEnglishOption = (l: MainCommunicationLanguageOption): boolean =>
  l.isoCode ? l.isoCode === "en" : l.title.toLowerCase() === "english";

// The org's main communication language is German, with English as the only
// secondary option — unlike "Residents speak", which allows any language.
export function getMainCommunicationLanguageOptions<T extends MainCommunicationLanguageOption>(apiLanguages: T[]): T[] {
  return apiLanguages.filter((l) => isGermanOption(l) || isEnglishOption(l));
}

export const createOpportunityDetailsSchema = (
  t: (key: string) => string,
  mainCommunicationLanguageOptions: MainCommunicationLanguageOption[] = [],
) =>
  z.object({
    title: z.string().min(1, t(`${i18nPrefix}.opportunityNameRequired`)),
    description: z.string().max(MAX_DESCRIPTION_LENGTH, t(`${i18nPrefix}.descriptionTooLong`)),
    numberOfVolunteers: z.string(),
    mainCommunication: z.array(languageObjectSchema).superRefine((langs, ctx) => {
      const selected = langs.filter(({ language }) => !!language);
      if (selected.length === 0) return; // nothing picked — always valid

      const resolvedOptions = selected.map(({ language }) =>
        resolveFormLanguageToOption(language, mainCommunicationLanguageOptions, t),
      );
      // No restriction on German vs. English vs. both — either works. A row
      // that fails to resolve is a legacy/out-of-set language (saved before
      // the dropdown was restricted to German/English, or no longer
      // offered) — that's still invalid, since only these two are offered.
      const hasUnresolved = resolvedOptions.some((opt) => !opt);
      if (hasUnresolved) {
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
  t: (key: string) => string,
  mainCommunicationLanguageOptions: MainCommunicationLanguageOption[] = [],
) => createOpportunityDetailsSchema(t, mainCommunicationLanguageOptions).omit({ title: true });

export type NewOpportunityDetailsFormData = z.infer<ReturnType<typeof createNewOpportunityDetailsSchema>>;
