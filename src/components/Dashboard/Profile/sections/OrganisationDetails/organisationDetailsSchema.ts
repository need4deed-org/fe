import { z } from "zod";

export const organisationDetailsSchema = z.object({
  about: z.string(),
  website: z.string(),
  address: z.string(),
  organisationType: z.string(),
  operator: z.string(),
  services: z.string(),
  clientLanguages: z.string(),
});

export type OrganisationDetailsFormData = z.infer<typeof organisationDetailsSchema>;
