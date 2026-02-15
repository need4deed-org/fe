import { LanguageLevel } from "@/types";
import { z } from "zod";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.nativeEnum(LanguageLevel), z.literal("")]),
});

const urlRegex = /^https?:\/\/.+/;

export const createOrganisationDetailsSchema = (t: (key: string) => string) => {
  const required = t(`${i18nPrefix}.required`);

  return z.object({
    about: z.string().min(1, required),
    website: z
      .string()
      .min(1, required)
      .refine((val) => urlRegex.test(val), {
        message: t(`${i18nPrefix}.websiteInvalid`),
      }),
    address: z.string().min(1, required),
    organisationType: z.string().min(1, required),
    operator: z.string().min(1, required),
    services: z.string().min(1, required),
    clientLanguages: z.array(languageObjectSchema).min(1, t(`${i18nPrefix}.clientLanguagesRequired`)),
  });
};

const i18nPrefix = "dashboard.agentProfile.organisationDetails.validation";

export type OrganisationDetailsFormData = z.infer<ReturnType<typeof createOrganisationDetailsSchema>>;
