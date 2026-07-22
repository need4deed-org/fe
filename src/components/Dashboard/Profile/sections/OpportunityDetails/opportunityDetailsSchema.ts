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

// `title` is translated into whatever language the option list was fetched
// in (German by default), so it's never the literal English word "german"/
// "english" — isoCode is the reliable, locale-independent signal. The title
// fallback (checking both English and German spellings) only matters for
// callers/tests that don't supply isoCode.
function toLangCode(option: MainCommunicationLanguageOption): "de" | "en" | null {
  if (option.isoCode === "de") return "de";
  if (option.isoCode === "en") return "en";
  const title = option.title.toLowerCase();
  if (["german", "deutsch"].includes(title)) return "de";
  if (["english", "englisch"].includes(title)) return "en";
  return null;
}

// The main-communication dropdown only offers German/English — no
// restriction on which of the two (or both) is picked.
export function getMainCommunicationLanguageOptions<T extends MainCommunicationLanguageOption>(apiLanguages: T[]): T[] {
  return apiLanguages.filter((l) => toLangCode(l) !== null);
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

      const resolved = selected.map(({ language }) =>
        resolveFormLanguageToOption(language, mainCommunicationLanguageOptions, t),
      );
      // No restriction on German vs. English vs. both — either works. A row
      // that fails to resolve is a legacy/out-of-set language (saved before
      // the dropdown was restricted to German/English, or no longer
      // offered) — that's still invalid, since only these two are offered.
      const hasUnresolved = resolved.some((option) => !option);
      const hasOutOfSet = resolved
        .filter((option): option is MainCommunicationLanguageOption => !!option)
        .some((option) => toLangCode(option) === null);
      if (hasUnresolved || hasOutOfSet) {
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
