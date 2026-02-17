import { AgentRoles, PHONE_NUMBER_REGEX } from "@/config/constants";
import { z } from "zod";

export const createAgentContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    firstName: z.string().min(1, t("dashboard.agentProfile.contactDetails.validation.nameRequired")),
    middleName: z
      .string()
      .min(1, t("dashboard.agentProfile.contactDetails.validation.nameRequired"))
      .optional()
      .or(z.literal("")),
    lastName: z.string().min(1, t("dashboard.agentProfile.contactDetails.validation.nameRequired")),
    role: z.array(z.enum(Object.values(AgentRoles))).optional(),
    email: z
      .string()
      .min(1, t("dashboard.agentProfile.contactDetails.validation.emailRequired"))
      .email(t("dashboard.agentProfile.contactDetails.validation.emailInvalid")),
    phone: z
      .string()
      .min(1, t("dashboard.agentProfile.contactDetails.validation.mobileRequired"))
      .regex(PHONE_NUMBER_REGEX, t("dashboard.agentProfile.contactDetails.validation.mobileInvalid")),
    landline: z
      .string()
      .regex(PHONE_NUMBER_REGEX, t("dashboard.agentProfile.contactDetails.validation.landlineInvalid"))
      .optional()
      .or(z.literal("")),
  });
};

export type AgentContactDetailsFormData = z.infer<ReturnType<typeof createAgentContactDetailsSchema>>;
