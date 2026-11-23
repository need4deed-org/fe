import { TFunction } from "i18next";
import { OpportunityType, VolunteerType } from "need4deed-sdk";
import { z } from "zod";

export const VOLUNTEER_TYPES = Object.values(OpportunityType) as VolunteerType[];

export const createEventRegistrationSchema = (t: TFunction) =>
  z.object({
    fullName: z.string().trim().min(1, t("eventRegistration.errors.required")),
    email: z
      .string()
      .trim()
      .pipe(z.email(t("eventRegistration.errors.email"))),
    phone: z.string().trim(),
    numberOfPeople: z
      .number({ error: t("eventRegistration.errors.people") })
      .int()
      .min(1, t("eventRegistration.errors.people"))
      .max(1000, t("eventRegistration.errors.people")),
    languagePreference: z.string().trim(),
    message: z.string().trim().max(500, t("eventRegistration.errors.message")),
    isVolunteer: z.boolean(),
    volunteerTypes: z.array(z.enum(VOLUNTEER_TYPES as [VolunteerType, ...VolunteerType[]])),
  });

export type EventRegistrationFormData = z.infer<ReturnType<typeof createEventRegistrationSchema>>;
