import { CommunicationType, ContactMethodType, ContactType } from "need4deed-sdk";
import { z } from "zod";

export const createValidationSchema = (t: (key: string) => string) =>
  z
    .object({
      contactType: z
        .enum(ContactType, {
          message: t("dashboard.communicationSection.contactTypeRequired"),
        })
        .optional(),
      contactMethod: z.enum(ContactMethodType),
      communicationType: z.enum(CommunicationType).optional(),
      date: z
        .date({
          message: t("dashboard.communicationSection.contactDateRequired"),
        })
        .max(new Date(), t("dashboard.communicationSection.futureDateError"))
        .refine((date) => date.getFullYear() >= 2025, {
          message: t("dashboard.communicationSection.contactDateRequired"),
        }),
    })
    .refine((data) => !!data.contactType, {
      path: ["contactType"],
      message: t("dashboard.communicationSection.contactTypeRequired"),
    });

export type CommunicationFormData = z.infer<ReturnType<typeof createValidationSchema>>;
