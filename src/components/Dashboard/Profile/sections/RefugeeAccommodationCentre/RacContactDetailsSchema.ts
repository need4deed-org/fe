import { AgentRoles } from "@/config/constants";
import { z } from "zod";

export const createRacContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    firstName: z.string().min(1, t("dashboard.rac.validation.nameRequired")),
    middleName: z.string().min(1, t("dashboard.rac.validation.nameRequired")).optional().or(z.literal("")),
    lastName: z.string().min(1, t("dashboard.rac.validation.nameRequired")),
    role: z.array(z.enum(Object.values(AgentRoles))).optional(),
    email: z
      .string()
      .min(1, t("dashboard.rac.validation.emailRequired"))
      .email(t("dashboard.rac.validation.emailInvalid")),
    phone: z
      .string()
      .min(1, t("dashboard.rac.validation.mobileRequired"))
      .regex(/^\+[0-9\s]+$/, t("dashboard.rac.validation.mobileInvalid")),
    landline: z
      .string()
      .regex(/^\+[0-9\s]+$/, t("dashboard.rac.validation.landlineInvalid"))
      .optional()
      .or(z.literal("")),
  });
};

export type RacContactDetailsFormData = z.infer<ReturnType<typeof createRacContactDetailsSchema>>;
