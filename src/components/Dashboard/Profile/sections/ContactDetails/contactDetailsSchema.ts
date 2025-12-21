import { VolunteerCommunicationType } from "need4deed-sdk";
import { z } from "zod";

export const createContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    phone: z
      .string()
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.phoneRequired"))
      .regex(/^\+[0-9]+$/, t("dashboard.volunteerProfile.contactDetails.validation.phoneInvalid")),
    email: z
      .string()
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.emailRequired"))
      .email(t("dashboard.volunteerProfile.contactDetails.validation.emailInvalid")),
    address: z.string().min(1, t("dashboard.volunteerProfile.contactDetails.validation.addressRequired")),
    preferredCommunicationType: z
      .array(z.enum(Object.values(VolunteerCommunicationType)))
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.preferredCommunicationTypeRequired")),
  });
};

export type ContactDetailsFormData = z.infer<ReturnType<typeof createContactDetailsSchema>>;
