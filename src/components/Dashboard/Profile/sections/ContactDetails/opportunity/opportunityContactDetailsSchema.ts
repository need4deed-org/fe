import { PrefferedCommunicationType } from "need4deed-sdk";
import { z } from "zod";

export const createOpportunityContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("dashboard.opportunityProfile.contactDetails.validation.nameRequired")),
    phone: z
      .string()
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.phoneRequired"))
      .regex(/^\+[0-9\s]+$/, t("dashboard.opportunityProfile.contactDetails.validation.phoneInvalid")),
    email: z
      .string()
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.emailRequired"))
      .email(t("dashboard.opportunityProfile.contactDetails.validation.emailInvalid")),
    waysToContact: z
      .array(z.enum(Object.values(PrefferedCommunicationType)))
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.waysToContactRequired")),
  });
};

export type OpportunityContactDetailsFormData = z.infer<ReturnType<typeof createOpportunityContactDetailsSchema>>;
