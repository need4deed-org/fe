import { Availability } from "@/components/forms/types";
import { LanguageLevel } from "@/types";
import { z } from "zod";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.nativeEnum(LanguageLevel), z.literal("")]),
});

export const createOpportunityDetailsSchema = () =>
  z.object({
    description: z.string(),
    numberOfVolunteers: z.string(),
    mainCommunication: z.array(languageObjectSchema),
    residentsSpeak: z.array(languageObjectSchema),
    availability: z.custom<Availability>(),
    activities: z.array(z.string()),
    skills: z.array(z.string()),
  });

export type OpportunityDetailsFormData = z.infer<ReturnType<typeof createOpportunityDetailsSchema>>;
