import { z } from "zod";

export const createContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    phoneNumber: z
      .string()
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.phoneRequired"))
      .regex(
        /^\+[0-9]+$/,
        t("dashboard.volunteerProfile.contactDetails.validation.phoneInvalid")
      ),
    email: z
      .string()
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.emailRequired"))
      .email(t("dashboard.volunteerProfile.contactDetails.validation.emailInvalid")),
    address: z
      .string()
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.addressRequired")),
    waysToContact: z.array(z.string()).min(1, t("dashboard.volunteerProfile.contactDetails.validation.waysToContactRequired")),
  });
};

export type ContactDetailsFormData = z.infer<ReturnType<typeof createContactDetailsSchema>>;
