import { LanguageLevel } from "@/types";
import { z } from "zod";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.nativeEnum(LanguageLevel), z.literal("")]),
});

export const organisationDetailsSchema = z.object({
  about: z.string(),
  website: z.string(),
  address: z.string(),
  organisationType: z.string(),
  operator: z.string(),
  services: z.string(),
  clientLanguages: z.array(languageObjectSchema),
});

export type OrganisationDetailsFormData = z.infer<typeof organisationDetailsSchema>;
